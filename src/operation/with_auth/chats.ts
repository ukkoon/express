import { extendType, list, nonNull, stringArg } from "nexus";
import { MemberAccessTokenPayload } from "../../interface/token_payloads";
import { User } from "../../object/user";
import { Chat } from "../../object/chat";
import { MESSAGE_PAGINATION_COUNT } from "../../constants";

export default extendType({
    type: "Query",
    definition(t) {
        t.field("chats", {
            type: list(Chat),
            description: "채팅 목록을 반환합니다.",
            authorize: async (root, args, ctx) => {
                let accessToken = ctx.guard.toPayload(ctx.request.headers.authorization!);
                let notExpired = Date.now() <= accessToken.exp! * 1000;
                return notExpired;
            },
            resolve: async (root, args, ctx, info) => {
                let payload = ctx.guard.toPayload(ctx.request.headers.authorization!) as MemberAccessTokenPayload;

                return await ctx.prisma.chat.findMany({
                    where: {
                        users: {
                            some: { id: payload.id }
                        }
                    },
                    include: {
                        messages: {
                            take: MESSAGE_PAGINATION_COUNT,
                            orderBy: {
                                createdAt: "desc"
                            }
                        }
                    },
                })
            }
        })
    }
})
