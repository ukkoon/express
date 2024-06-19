import { loadFilesSync } from '@graphql-tools/load-files';
import { makeSchema, fieldAuthorizePlugin } from 'nexus'
import * as path from "path";

export default makeSchema({
    features: {
        abstractTypeStrategies: {
            resolveType: false
        }
    },
    types: loadFilesSync([
        path.join(__dirname, "./object/**/*.ts"),
        path.join(__dirname, "./operation/**/*.ts")
    ]),
    plugins: [
        fieldAuthorizePlugin(),
    ],
    outputs: {
        typegen: path.join(__dirname, ".", "nexus-typegen.ts"),
        schema: path.join(__dirname, ".", "schema.graphql"),
    },
    sourceTypes: {
        debug: process.env.NODE_ENV !== "prod",
        modules: [
            {
                module: require.resolve('.prisma/client/index.d.ts'),
                alias: "prisma",
            },
        ],
    },
    contextType: {
        module: process.env.NODE_ENV !== "prod"
            ? `${__dirname}/interface/context.ts`
            : `${__dirname}/interface/context.js`,
        export: "Context",
    },
});
