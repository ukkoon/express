import { PrismaClient } from "@prisma/client"

export default function deletedRecordBlocker(prisma: PrismaClient) {
    prisma.$extends({
        query: {
            user: {
                async findMany({ model, operation, args, query }) {
                    args.where = { ...args.where, isDeleted: false }
                    return query(args)
                },
            },
        }
    });
}