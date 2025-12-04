import { env } from "@/env";
import { PrismaClient } from "../src/lib/generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";
const POOLED_DATABASE_URL = env.DATABASE_URL;

const adapter = new PrismaPg({
   connectionString: POOLED_DATABASE_URL,
});

const globalForPrisma = global as unknown as {
   prisma: PrismaClient;
};
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
