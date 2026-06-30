// Prisma client singleton — safe for Vercel serverless (avoids exhausting connections)
const { PrismaClient } = require('@prisma/client');

const g = globalThis;
const prisma = g.__crPrisma || new PrismaClient({ log: ['warn', 'error'] });
if (!g.__crPrisma) g.__crPrisma = prisma;

module.exports = { prisma };
