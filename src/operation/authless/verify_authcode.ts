import { extendType, nonNull, stringArg } from "nexus";
import { ACCESS_TOKEN_EXP_IN } from "../../constants";
import { Context } from "../../interface/context";
import { MemberAuthorizingTokenPayload } from "../../interface/token_payloads";

export default extendType({
    type: "Query",
    definition(t) {
        t.field("verifyAuthcode", {
            type: "String",
            description: "휴대폰번호로 전송된 인증번호를 인증합니다. 인증이 성공할 경우 verfied된 payload를 jwt형태로 반환받습니다.",
            args: {
                jwt: nonNull(stringArg()),
                authcode: nonNull(stringArg())
            },
            authorize: async (root, args, ctx) => {
                /**
                 * 인증번호 일치여부 확인
                 */
                let payload = ctx.guard.toPayload(args.jwt) as MemberAuthorizingTokenPayload
                return args.authcode === payload.authcode;
            },
            resolve: async (root, args, ctx: Context, info) => {
                let payload = ctx.guard.toPayload(args.jwt) as MemberAuthorizingTokenPayload
                let user = await ctx.prisma.user.findUnique({
                    where: {
                        countryCode_phoneNum: {
                            countryCode: parseInt(payload.countryCode),
                            phoneNum: payload.phonenum,
                        }
                    }
                })

                if (user != null)
                    payload.id = user.id


                return ctx.guard.toToken({
                    id: `${user?.id}`,
                    countryCode: payload.countryCode,
                    phonenum: payload.phonenum,
                    verified: true,
                }, ACCESS_TOKEN_EXP_IN)
            },
        })
    }
})