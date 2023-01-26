import { prisma } from "~/db.server";

export async function createEmployee(name, phone, email, nationalId, salary) {
    const employee = await getEmployeeByMobile(phone);
    if (employee) {
        throw new Response('Employee already exists!', {
            status: 400
        });
    }
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

export async function getEmployeeById(id) {
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

export async function getEmployeeByMobile(phone) {
    return prisma.employee.findFirst({
        where: {
            mobile: phone
        },
        include: {
            advance: true,
            paid: true,
        }
    });
}

export async function searchEmployees(query) {
    return prisma.employee.findMany({
        select: {
            name: true,
            mobile: true,
            id: true,
        },
        where: {
            OR: [{ name: { contains: query } }, { mobile: { contains: query } }],
        },
        take: 8,
    });
}



