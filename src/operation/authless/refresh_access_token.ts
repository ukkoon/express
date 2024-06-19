import { extendType, nonNull, stringArg } from "nexus";
import { ACCESS_TOKEN_EXP_IN, REFRESH_TOKEN_EXP_IN } from "../../constants";
import { Context } from "../../interface/context";
import { AuthPayload } from "../../object/payload/auth_payload";
import { AdminAccessTokenPayload, AdminRefreshTokenPayload, MemberAccessTokenPayload, MemberRefreshTokenPayload } from "../../interface/token_payloads";

export default extendType({
    type: "Query",
    definition(t) {
        t.field("refreshAccessToken", {
            type: AuthPayload,
            description: "refreshToken을 이용해 accessToken을 갱신합니다. 만료 등으로 인한 에러 발생시, signOut시키는 로직을 프론트엔드에서 구현하세요.",
            args: {
                refreshToken: nonNull(stringArg())
            },
            authorize: async (root, args, ctx: Context) => {
                /**
                 * refreshToken 만료 여부 확인, 유저 존재 여부 확인
                 */
                let refreshTokenPayload = ctx.guard.toPayload(args.refreshToken);
                let notExpired = Date.now() <= refreshTokenPayload.exp! * 1000;
                let isUserExist = Boolean(await ctx.prisma.user.count({
                    where: {
                        id: refreshTokenPayload.id
                    }
                }));

                return notExpired && isUserExist;
            },
            resolve: async (root, args, ctx: Context, info) => {
                let refreshTokenPayload = ctx.guard.toPayload(args.refreshToken);

                let accessToken = ctx.guard.toToken({
                    id: refreshTokenPayload!.id,
                    type: refreshTokenPayload.type,
                    email: refreshTokenPayload.email,
                    verified: true
                } as MemberAccessTokenPayload | AdminAccessTokenPayload | any,
                    ACCESS_TOKEN_EXP_IN
                );

                let refreshToken = ctx.guard.toToken({
                    accessToken,
                    id: refreshTokenPayload!.id,
                    type: refreshTokenPayload.type,
                    email: refreshTokenPayload.email,
                } as AdminRefreshTokenPayload | MemberRefreshTokenPayload | any,
                    REFRESH_TOKEN_EXP_IN
                );

                return {
                    accessToken,
                    refreshToken,
                };
            },
        })
    }
})