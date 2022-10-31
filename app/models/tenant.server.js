import { prisma } from "~/db.server";

export async function createTenant(name, phone, email, nationalId, moveInDate, vehicleRegistration) {
    // Check if tenant exists first
    const tenants = await getTenants();
    const match = tenants.find(tenant => tenant.mobile === phone);
    const currentYear = new Date().getFullYear();
    if (match) {
        throw new Response("This mobile number has been used!", {
            status: 400
        });
    }
    return prisma.tenant.create({
        data: {
            name,
            mobile: phone,
            email,
            nationalId,
            arrears: 0,
            moveInDate,
            years: {
                create: {
                    year: currentYear
                }
            },
            vehicleRegistration
        }
    });
}

export async function getTenants() {
    return prisma.tenant.findMany({
        include: {
            house: true,
            years: true,
        }
    });
}

export async function getTenant(tenantId) {
    return prisma.tenant.findUnique({
        where: {
            id: tenantId
        },
        include: {
            house: true,
            years: true,
        }
    });
}

export async function getTenantByMobile(mobile) {
    return prisma.tenant.findUnique({
        where: {
            mobile
        },
        include: {
            house: true,
            years: true,
        }
    });
}

export async function getTenantByEmail(email) {
    return prisma.tenant.findUnique({
        where: {
            email
        },
        include: {
            house: true,
            years: true,
        }
    })
}