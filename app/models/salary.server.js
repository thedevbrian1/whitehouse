import { prisma } from "~/db.server";

export async function createSalaryPayment(employeeId, amount) {
    return prisma.salary.create({
        data: {
            amount,
            employeeId
        }
    });
}

export async function getSalaries() {
    return prisma.salary.findMany({
        include: {
            Employee: true
        }
    });
}