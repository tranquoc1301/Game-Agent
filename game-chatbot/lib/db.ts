import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Singleton
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Adapter
const adapter = new PrismaPg(pool);

// Prisma Client
export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
