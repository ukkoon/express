import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import 'dotenv/config';
import guard from "./context/guard";
import prisma from "./context/prisma/prisma";
import { Context } from "./interface/context";
import schema from "./schema";

dotenv.config({ path: '.env.dev' });

/**
 * CORS 설정 등을 적용하지 않은 간이 서버
 */

let server = new ApolloServer({
    schema: schema,
    introspection: true
});

startStandaloneServer(server, {
    listen: { port: parseInt(process.env.PORT!) },
    context: async (context): Promise<Context> => ({
        prisma,
        guard,
        request: context.req
    }),
});