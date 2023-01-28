import { prisma } from "~/db.server";
import { getTenantById } from "./tenant.server";

export async function createTenantPayment(tenantId, status) {
    // const currentYear = new Date().getFullYear();
    const month = new Date().toLocaleString('default', { month: 'long' }).toLowerCase();

    let monthObject = { [month]: status };
    // Check if tenant exists
    const tenant = await getTenantById(tenantId);
    if (!tenant) {
        throw new Response('Tenant does not exist!', {
            status: 400
        });
    }

    return prisma.year.update({
        where: {
            tenantId
        },
        data: monthObject
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