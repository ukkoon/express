import { PrismaClient } from "@prisma/client";
import { Guard } from "../context/guard";


export interface Context {
    prisma: PrismaClient,
    guard: Guard,
    request: { headers: { authorization?: string } },
}