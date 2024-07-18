import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import guard from "./context/guard";
import prisma from "./context/prisma/prisma";
import { Context } from "./interface/context";
import schema from "./schema";
import "./config";

/**
 * CORS 설정 등을 적용하지 않은 간이 서버
 */

let server = new ApolloServer({
    schema: schema,
    introspection: process.env.NODE_ENV==='dev'
});

startStandaloneServer(server, {
    listen: { port: parseInt(process.env.PORT!) },
    context: async (context): Promise<Context> => ({
        prisma,
        guard,
        request: context.req
    }),
}).then((e)=>{
    console.log(`server running on ${e.url}`)
});