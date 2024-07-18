import { PrismaClient } from "@prisma/client";
import deletedRecordBlocker from "./middleware/deleted_record_blocker";
import requestLatencyCheck from "./middleware/latency_checker";

let prisma = new PrismaClient({ log: ['query', 'info', 'error', 'warn'] })

deletedRecordBlocker(prisma)
requestLatencyCheck(prisma)

export default prisma;
