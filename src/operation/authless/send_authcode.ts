import { extendType, nonNull, stringArg } from "nexus";
import { AUTHCODE_TOKEN_EXP_IN } from "../../constants";
import { Context } from "../../interface/context";
import { generateAuthcode } from "../../utils";
import { MemberAuthorizingTokenPayload } from "../../interface/token_payloads";

export default extendType({
    type: "Query",
    definition(t) {
        t.field("sendAuthcode", {
            type: "String",
            description: "제시된 휴대폰번호로 인증번호가 전송됩니다. 이 인증번호와 반환값(jwt)을 인자로 verifyAuthcode를 호출하면 accessToken을 획득합니다.",
            args: {
                countryCode: nonNull(stringArg()),
                phonenum: nonNull(stringArg()),
            },
            authorize: async (root, args, ctx: Context) => {
                /**
                 * 발송 횟수 카운트 체크 등의 검사
                 */
                return true;
            },
            resolve: async (root, args, ctx: Context, info) => {
                /**
                 * 인증번호 할당
                 */
                // let authcode = generateAuthcode(args.phonenum)
                let authcode = "123456";

                /**
                 * 실제 인증번호 발송
                 */
                // var contents = `휴대폰인증 인증번호는 [${authcode}]입니다.`
                // await ctx.popbill.sendSms({ text: contents, to: args.phonenum })

                let jwt = ctx.guard.toToken({
                    countryCode: args.countryCode,
                    phonenum: args.phonenum,
                    authcode: authcode,
                    verified: false
                } as MemberAuthorizingTokenPayload,
                    AUTHCODE_TOKEN_EXP_IN);

                return jwt;
            },
        })
    }
})