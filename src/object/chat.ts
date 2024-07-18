import { objectType } from "nexus";
import { SharedField } from "./shared_field";
import { User } from "./user";

export const Chat = objectType({
    name: "Chat",
    definition(t) {
        t.implements(SharedField)
    }
})
