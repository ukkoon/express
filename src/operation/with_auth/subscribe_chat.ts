import { nonNull, stringArg, subscriptionType } from "nexus";
import { ChatMessage } from "../../object/chat_message";
import prisma from "@prisma/client";

export default subscriptionType({
    definition(t) {
        t.field('subscribeChats', {
            type: ChatMessage,
            subscribe: async (root, args, ctx, info,) => {
                const payload = ctx.guard.toPayload(ctx.connectionParams.Authorization!);
                const chatIds = await ctx.prisma.chat.findMany({
                    where: {
                        users: {
                            some: {
                                id: payload.id
                            }
                        }
                    },
                    select: {
                        id: true
                    }
                })
                return ctx.pubsub.asyncIterator(chatIds.map((e: any) => e.id.toString()));

            },
            resolve: async (payload: prisma.ChatMessage, args, ctx, info) => {
                
                return payload
            }
        })
    },
});