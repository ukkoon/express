import { extendType, nonNull, stringArg } from "nexus";
import { MemberAccessTokenPayload } from "../../interface/token_payloads";
import { User } from "../../object/user";

export default extendType({
    type: "Query",
    definition(t) {
        t.field("me", {
            type: User,
            description: "내 정보를 확인합니다.",
            authorize: async (root, args, ctx) => {
                let accessToken = ctx.guard.toPayload(ctx.request.headers.authorization!);
                let notExpired = Date.now() <= accessToken.exp! * 1000;
                return notExpired;
            },
            resolve: async (root, args, ctx, info) => {
                let payload = ctx.guard.toPayload(ctx.request.headers.authorization!) as MemberAccessTokenPayload;

                return await ctx.prisma.user.findUnique({
                    where: { id: payload.id }
                })
            }
        })
    }
})
