import { extendType, nonNull, stringArg } from "nexus";

export default extendType({
    type: "Query",
    definition(t) {
        t.field("verifyAccessToken", {
            type: "Boolean",
            description: "accessToken이 유효한지 검사합니다.",
            args: {
                accessToken: nonNull(stringArg())
            },
            authorize: async (root, args, ctx) => {
                /**
                 * accessToken 만료 여부 확인
                 */
                let accessToken = ctx.guard.toPayload(args.accessToken);
                let notExpired = Date.now() <= accessToken.exp! * 1000;
                return notExpired;
            },
            resolve: async (root, args, ctx, info) => {
                return true
            }
        })
    }
})