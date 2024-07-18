import { LoginType } from "@prisma/client";
import { extendType, nonNull, stringArg } from "nexus";
import { MemberAccessTokenPayload, MemberAuthorizingTokenPayload } from "../../interface/token_payloads";

import * as argon2 from 'argon2';
import "../../config";
import { AuthPayload } from "../../object/payload/auth_payload";
import { ACCESS_TOKEN_EXP_IN, REFRESH_TOKEN_EXP_IN } from "../../constants";

export default extendType({
    type: "Query",
    definition(t) {
        t.field("signUp", {
            type: AuthPayload,
            description: "인증이 완료된 토큰으로 가입합니다.",
            args: {
                verifiedToken: nonNull(stringArg()),
                name: nonNull(stringArg()),
                loginId: nonNull(stringArg()),
                loginPw: nonNull(stringArg()),
            },
            authorize: async (root, args, ctx) => {
                /**
                 * accessToken 만료 여부 확인
                 */
                let verifiedToken = ctx.guard.toPayload(args.verifiedToken);
                let notExpired = Date.now() <= verifiedToken.exp! * 1000;

                return notExpired && verifiedToken.verified;
            },
            resolve: async (root, args, ctx, info) => {
                let payload = ctx.guard.toPayload(args.verifiedToken) as MemberAuthorizingTokenPayload;

                let { id } = await ctx.prisma.user.create({
                    data: {
                        loginType: LoginType.ID_PW,
                        name: args.name,
                        countryCode: payload.countryCode,
                        phoneNum: payload.phoneNum,
                        loginId: args.loginId,
                        loginPw: await argon2.hash(args.loginPw, {
                            salt: Buffer.from(process.env.ARGON2_SALT!, 'binary'),
                        }),
                    }
                });

                let accessToken = ctx.guard.toToken({
                    id: id,
                } as MemberAccessTokenPayload, ACCESS_TOKEN_EXP_IN);

                let refreshToken = ctx.guard.toToken({
                    id: id,
                    accessToken: accessToken
                }, REFRESH_TOKEN_EXP_IN);

                return {
                    accessToken,
                    refreshToken
                };
            }
        })
    }
})