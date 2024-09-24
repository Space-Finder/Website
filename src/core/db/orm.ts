import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    return new PrismaClient(
        process.env.NODE_ENV == "development"
            ? {
                  log: ["query", "info", "warn", "error"],
              }
            : undefined,
    );
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export default prisma;
