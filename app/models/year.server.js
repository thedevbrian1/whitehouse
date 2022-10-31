import { prisma } from "~/db.server";
import { getTenant } from "./tenant.server";

export async function createTenantPayment(tenantId, amount) {
    // const currentYear = new Date().getFullYear();
    // const month = new Date().toLocaleString('default', { month: 'long' }).toLowerCase();
    // Check if tenant exists
    const tenant = await getTenant(tenantId);
    if (!tenant) {
        throw new Response('Tenant does not exist!', {
            status: 400
        });
    }

    return prisma.year.update({
        where: {
            tenantId
        },
        data: {
            october: amount
        }
    });
}

export async function getYears() {
    return prisma.year.findMany();
}

export async function getYear(tenantId) {
    return prisma.year.findUnique({
        where: {
            tenantId
        }
    });
}