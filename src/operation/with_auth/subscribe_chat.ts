import { nonNull, stringArg, subscriptionType } from "nexus";
import { ChatMessage } from "../../object/chat_message";

export default subscriptionType({
    definition(t) {
        t.field('subscribeChats', {
            type: ChatMessage,          
            subscribe: async (root, args, ctx, info,) => {
                //@ts-ignore
                let payload = ctx.guard.toPayload(ctx.connectionParams.Authorization!);
                return ctx.pubsub.asyncIterator([payload.id]);

            },      
            //@ts-ignore
            resolve: async (payload, args, ctx, info) => {
                return payload
            }
        })
    },
});