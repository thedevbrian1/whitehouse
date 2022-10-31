import { prisma } from "~/db.server";

export async function createAdvance(employeeId, amount) {
    // const employee = await getEmployee(id);
    return prisma.advance.create({
        data: {
            amount,
            employeeId
        }
    });

}

export async function getAdvances() {
    return prisma.advance.findMany({
        include: {
            Employee: true
        }
    });
}

export async function getAdvancesById(employeeId) {
    return prisma.advance.findMany({
        where: {
            employeeId
        }
    });
}

