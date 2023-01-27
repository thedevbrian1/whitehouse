import { prisma } from "~/db.server";

export async function getTransactions() {
    return prisma.transaction.findMany();
}

export async function getTenantTransactions(tenantId) {
    return prisma.transaction.findMany({
        where: {
            tenantId
        }
    });
}

export async function createCashTransaction(amount, type, paidMonth, paidYear, tenantId) {
    return prisma.transaction.create({
        data: {
            amount,
            type,
            paidMonth,
            paidYear,
            tenantId
        }
    });
}

export async function createMpesaTransaction(amount, type, tenantId) {
    return prisma.transaction.create({
        data: {
            amount,
            type,
            tenantId
        }
    });
}