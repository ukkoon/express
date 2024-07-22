import { PrismaClient } from "@prisma/client";
import { Guard } from "../context/guard";
import { PubSub } from "graphql-subscriptions";

export interface Context {
    prisma: PrismaClient,
    guard: Guard,
    pubsub: PubSub,
    request: { headers: { authorization?: string } },
}