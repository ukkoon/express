import { list, objectType } from "nexus";
import { SharedField } from "./shared_field";
import { User } from "./user";
import { Chat } from "./chat";
import { Context } from "../interface/context";

export const ChatMessage = objectType({
    name: "ChatMessage",
    definition(t) {
        t.implements(SharedField)
        t.nonNull.string("text")
        t.nonNull.int("userId")
        t.nonNull.int("chatId")
    }
})
    