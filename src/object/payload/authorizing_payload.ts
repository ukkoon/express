import { objectType } from "nexus"

export const AuthorizingPayload = objectType({
    name: "AuthorizingPayload",
    definition(t) {
        t.string('jwt')
        t.nonNull.boolean('hasSignedUp')
    }
})
