import { prisma } from "~/db.server";
//TODO: Form validation
export async function createHouse(plotNo, houseNo, tenantId) {
    // Check if house exists
    const houses = await getHouses();
    const match = houses.find(house => house.houseNumber === houseNo && house.plotNumber === plotNo);

    if (match) {
        throw new Response("House exists!", {
            status: 400
        });
    }
    return prisma.house.create({
        data: {
            houseNumber: houseNo,
            plotNumber: plotNo,

            // arrears: 0,
            occupied: true,
            tenantId,
            // years: {
            //     create: {
            //         year: new Date().getFullYear(),
            //         january: 'paid',
            //         february: 'paid',
            //         march: 'not paid',
            //         april: 'paid',
            //         may: 'paid',
            //         june: 'not paid',
            //         july: 'paid',
            //         august: 'paid',
            //         september: '',
            //         october: '',
            //         november: '',
            //         december: ''

            //     }
            // }
        }
    });
}

export async function getHouses() {
    return prisma.house.findMany({
        include: {
            tenant: true,
        }
    });
}

export async function getHouse(plotNo, houseNo) {
    return prisma.house.findFirst({
        where: {
            houseNumber: houseNo,
            plotNumber: Number(plotNo),
        }
        // include: {
        //     tenant: true,
        //     years: true
        // },
    });
}

export async function getSelectedHouses(plot) {
    return prisma.house.findMany({
        where: {
            plotNumber: Number(plot)
        },
        include: {
            tenant: true
        }
    });
}

export async function clearDatabase() {
    return Promise.all([
        prisma.house.deleteMany(),
        prisma.tenant.deleteMany(),
        prisma.year.deleteMany()
    ]);
}