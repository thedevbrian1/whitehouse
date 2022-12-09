import { prisma } from "~/db.server";
// TODO: Check if employee exists in the db first
export async function createEmployee(name, phone, email, nationalId, salary) {
    return prisma.employee.create({
        data: {
            name,
            mobile: phone,
            email,
            nationalId: Number(nationalId),
            salary: Number(salary),
        }
    });
}

export async function getEmployees() {
    return prisma.employee.findMany({
        include: {
            advance: true,
            paid: true
        }
    });
}

export async function getEmployee(id) {
    return prisma.employee.findUnique({
        where: {
            id
        },
        include: {
            advance: true,
            paid: true,
        }
    });
}



