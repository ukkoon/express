import { objectType } from "nexus";
import { SharedField } from "./shared_field";

export const User = objectType({
    name: "User",
    definition(t) {
        t.implements(SharedField)
        t.nonNull.string("loginType")
        t.nonNull.string("loginId")
        t.nonNull.int("countryCode")
        t.nonNull.string("phoneNum")

    }
})
