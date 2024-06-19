import { PrismaClient } from "@prisma/client";

export default function requestLatencyCheck(prisma: PrismaClient) {
    prisma.$extends({
        query: {
            $allOperations: async (params) => {
                const before = Date.now()
                console.log("INIT MIDDLEWARE 'requestLatencyCheck'")
                const after = Date.now()
                console.log(`Query ${params.model}.${params.args} took ${after - before}ms`)
            }
        }
    })
}