import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import { PubSub } from "graphql-subscriptions";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import guard from "./context/guard";
import prisma from "./context/prisma/prisma";
import schema from "./schema";
import { expressMiddleware } from '@apollo/server/express4';
import express from "express"
import cors from 'cors';
import "./config";


const pubsub = new PubSub();

/**
 * CORS 설정 등을 적용하지 않은 간이 서버
 */


const startServer = async () => {
    const app = express();
    const httpServer = createServer(app);

    httpServer.on('request', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*'); // 필요시 CORS 설정 추가
        // 기타 조건에 따라 API 응답 추가
    });

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
        perMessageDeflate: false, // 압축 해제 옵션을 비활성화하여 안정성을 높일 수 있습니다.
        clientTracking: true, // 클라이언트 추적 활성화
    });

    const serverCleanup = useServer({
        schema,
        context: async (ctx, msg, args) => {
            // This will be run every time the client sends a subscription request

            return {
                prisma,
                guard,
                pubsub,
                ...ctx
            };
        },
        onConnect: (ctx) => {
            console.log('Connected!');
        },
        onDisconnect: (ctx, code, reason) => {
            console.log('Disconnected!');
        },
        onSubscribe: async (ctx, msg) => {
            console.log('Subscribe!');
            // 여기서 GraphQLErrors를 반환해야 하는 경우를 처리합니다
            return;
        },
        onNext: (ctx, msg, args, result) => {
            console.log('Next!')
            // 처리된 결과를 논리적으로 반환
            return result;
        },
        onError: (ctx, msg, errors) => {
            console.log('Error!')
            return errors;
        },
        onComplete: () => {
            console.log('Connection completed');
        },
    }, wsServer);

    let apolloServer = new ApolloServer({
        schema,
        introspection: process.env.NODE_ENV === 'dev',
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            }],
    });

    await apolloServer.start();

    app.use('/graphql', cors(), express.json(), expressMiddleware(apolloServer, {
        context: async (context) => ({
            prisma,
            guard,
            pubsub,
            request: context.req
        })
    }),);

    httpServer.listen({ port: parseInt(process.env.PORT!) }, () => {
        console.log(`Server is now running on http://localhost:${process.env.PORT}/graphql`);
    });
};

startServer();