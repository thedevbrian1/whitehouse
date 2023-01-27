import { prisma } from "~/db.server";

export async function createArrear(amount, month, year, tenantId) {
    return prisma.arrear.create({
        data: {
            amount: Number(amount),
            month,
            year,
            tenantId
        }
    });
}