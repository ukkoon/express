import { Prisma, User } from "@prisma/client";
import { extendType, nonNull, stringArg } from "nexus";
import { MemberAccessTokenPayload } from "../../interface/token_payloads";

import * as argon2 from 'argon2';
import "../../config";
import { ACCESS_TOKEN_EXP_IN, REFRESH_TOKEN_EXP_IN } from "../../constants";
import { AuthPayload } from "../../object/payload/auth_payload";

export default extendType({
    type: "Query",
    definition(t) {
        t.field("signIn", {
            type: AuthPayload,
            description: "Id/Pw로 로그인합니다.",
            args: {
                loginId: nonNull(stringArg()),
                loginPw: nonNull(stringArg()),
            },
            authorize: async (root, args: any, ctx) => {
                // Prisma Query
                // const user = await ctx.prisma.user.findFirst({
                //     where:{
                //         loginId:args.loginId
                //     },
                //     select:{
                //         id:true,
                //         loginPw:true
                //     }
                // })

                // Raw Query
                const result: User[] = await ctx.prisma.$queryRaw(Prisma.sql
                    `select "id", "loginPw" from "User" where "loginId"=${args.loginId}`
                );
                const user = result[0]
                const verified = await argon2.verify(user!.loginPw, args.loginPw,)

                args['userId'] = user!.id;
                return verified;
            },
            resolve: async (root, args: any, ctx, info) => {
                const id = args['userId']

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