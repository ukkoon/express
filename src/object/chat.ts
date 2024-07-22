import { list, objectType } from "nexus";
import { SharedField } from "./shared_field";
import { User } from "./user";
import { ChatMessage } from "./chat_message";

export const Chat = objectType({
    name: "Chat",
    definition(t) {
        t.implements(SharedField)
        t.field("messages", { type: list(ChatMessage) })
    }
})
