import { interfaceType } from "nexus";

export const SharedField = interfaceType({
    name: "SharedField",
    definition(t) {
        t.nonNull.string("id")
        t.nonNull.string("createdAt")
        t.nonNull.string("updatedAt")
        t.nonNull.boolean("isDeleted")
    }
})

