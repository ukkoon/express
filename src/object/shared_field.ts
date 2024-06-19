import { interfaceType, nonNull } from "nexus";
import { DateTime } from "./scalar/date_time";

export const SharedField = interfaceType({
    name: "SharedField",
    definition(t) {
        t.nonNull.string("id")
        t.nonNull.string("createdAt")
        t.nonNull.string("updatedAt")
    }
})

