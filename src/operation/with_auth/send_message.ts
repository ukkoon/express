import { extendType, nonNull, stringArg } from "nexus";
import { MemberAccessTokenPayload } from "../../interface/token_payloads";

export default extendType({
    type: "Mutation",
    definition(t) {
        t.field("sendMessage", {
            type: "Boolean",
            description: "상대 유저에게 메시지를 보냅니다.",
            args: {
                receiverLoginId: nonNull(stringArg()),
                text: nonNull(stringArg()),
            },
            authorize: async (root, args, ctx) => {
                /**
                 * accessToken 만료 여부 확인
                 */
                let accessToken = ctx.guard.toPayload(ctx.request.headers.authorization!);
                let notExpired = Date.now() <= accessToken.exp! * 1000;
                return notExpired;
            },
            resolve: async (root, args, ctx, info) => {
                let payload = ctx.guard.toPayload(ctx.request.headers.authorization!) as MemberAccessTokenPayload;

                await ctx.prisma.$transaction(async (prisma:any) => {
                    let chat = await prisma.chat.findFirst({
                        where: {
                            AND: [
                                {
                                    users: {
                                        some: {
                                            loginId: args.receiverLoginId
                                        }
                                    }
                                },
                                {
                                    users: {
                                        some: {
                                            id: payload.id
                                        }
                                    }
                                }
                            ]
                        },
                        select: {
                            id: true
                        }
                    });
                    if (!chat) {
                        chat = await prisma.chat.create({
                            data: {
                                users: {
                                    connect: [
                                        { id: payload.id },
                                        { loginId: args.receiverLoginId }
                                    ]
                                }
                            }
                            , select: {
                                id: true
                            }
                        })
                    }

                    await prisma.chatMessage.create({
                        data: {
                            text: args.text,
                            chat: {
                                connect: {
                                    id: chat.id
                                }
                            },
                            user: {
                                connect: {
                                    id: payload.id
                                }
                            }
                        }
                    })
                })

                return true
            }
        })
    }
})
