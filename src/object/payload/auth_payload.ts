import { objectType } from "nexus";

export const AuthPayload = objectType({
    name: "AuthPayload",
    definition(t) {
        t.nonNull.string("accessToken", { description: "api를 사용하는데 필요한 토큰입니다." })
        t.nonNull.string("refreshToken", { description: "accessToken을 재발급 받는데 필요한 토큰입니다." })
    }
})