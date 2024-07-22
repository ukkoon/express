import { extendType, intArg, list, nonNull, stringArg } from "nexus";
import { MemberAccessTokenPayload } from "../../interface/token_payloads";
import { User } from "../../object/user";
import { Chat } from "../../object/chat";
import { ChatMessage } from "../../object/chat_message";
import { MESSAGE_PAGINATION_COUNT } from "../../constants";

export default extendType({
    type: "Query",
    definition(t) {
        t.field("messages", {
            type: list(ChatMessage),
            args: {
                chatId: nonNull(intArg()),
                skip: nonNull(intArg()),
            },
            description: "메시지 목록을 반환합니다.",
            authorize: async (root, args: any, ctx) => {
                let payload = ctx.guard.toPayload(ctx.request.headers.authorization!);
                let notExpired = Date.now() <= payload.exp! * 1000;

                let chat = await ctx.prisma.chat.findFirst(
                    {
                        where: {
                            id: args.chatId,
                            users: {
                                some: {
                                    id: payload.id
                                }
                            },
                        },
                        include: {
                            messages: {
                                skip: args.skip,
                                take: MESSAGE_PAGINATION_COUNT,
                                orderBy: {
                                    createdAt: 'desc'
                                }
                            }
                        }
                    }
                );


                args['chat'] = chat;


                return notExpired && Boolean(chat);
            },
            resolve: async (root, args:any, ctx, info) => {
                
                return args.chat.messages;
            }
        })
    }
})
