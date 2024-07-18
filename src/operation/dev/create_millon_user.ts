import { LoginType } from "@prisma/client";
import { extendType } from "nexus";

import * as argon2 from 'argon2';
import "../../config";

export default extendType({
    type: "Query",
    definition(t) {
        t.field("createMillonUser", {
            type: "Boolean",
            description: "테스트로 100만 명의 유저를 생성합니다.",
            authorize: async (root, args: any, ctx) => {
                return process.env.NODE_ENV === "dev";
            },
            resolve: async (root, args: any, ctx, info) => {
                const CHUNK_SIZE = 1000; // 한 번에 삽입할 데이터 개수

                const loginPw = await argon2.hash(`pw`, {
                    salt: Buffer.from(process.env.ARGON2_SALT!, 'binary'),
                })

                for (let i = 1000; i < 1000000; i += CHUNK_SIZE) {
                    const users = [];

                    for (let j = 0; j < CHUNK_SIZE; j++) {
                        const loginType = LoginType.ID_PW;
                        const countryCode = 82;
                        const phoneNum = `010${i+j}`;
                        const name = `name${i + j}`;
                        const loginId = `id${i + j}`;
                        users.push({ loginType, countryCode, phoneNum, name, loginId, loginPw });
                    }

                    // 트랜잭션을 사용하여 한 번에 삽입
                    await ctx.prisma.user.createMany({
                        data: users,
                    });

                    console.log(`Inserted ${i + CHUNK_SIZE} users`);
                }
                return true;
            }
        })
    }
})