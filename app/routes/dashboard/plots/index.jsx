import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/outline";
import { Link, Form, useLoaderData, useTransition, useSubmit, useActionData, useCatch } from "@remix-run/react";
import { useRef } from "react";
// import { prisma } from "~/db.server";
import { createHouse, clearDatabase, getHouses, getSelectedHouses } from "../../../models/house.server";
import { getTenants } from "../../../models/tenant.server";

export async function loader() {

    const houses = await getHouses();
    const tenants = await getTenants();
    // console.log({ tenants });
    // console.log({ houses });

    return houses;
}

export async function action({ request }) {

    const formData = await request.formData();
    const action = formData.get('_action');
    if (action === 'addHouse') {
        const plotNo = formData.get('plotNo');
        const houseNo = formData.get('houseNo');
        const name = formData.get('name');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const date = formData.get('moveInDate');
        const carRegistration = formData.get('carRegistration');

        const moveInDate = new Date(date);
        console.log({ moveInDate });
        const house = await createHouse(plotNo, houseNo, name, phone, email, moveInDate, carRegistration);
        console.log({ house });
        return null;
    }

    if (action === 'selectPlot') {
        const plot = formData.get('plot');
        // console.log('Selected Plot: ', plot);

        const houses = await getSelectedHouses(plot);
        console.log({ selected: houses.length });
        if (houses.length === 0) {
            throw new Response('No registered tenants for this plot!', {
                status: 404
            });
        }
        // console.log('Matched houses: ', houses);
        return houses;
    }
    if (action === 'clearDatabase') {
        const deletedRecords = await clearDatabase();
        return null;
    }
    return null;
}

export function meta() {
    return {
        title: 'Plots | White House Court'
    };
}

export default function PlotsIndex() {
    const data = useLoaderData();
    const actionData = useActionData();

    // TODO: Add search functionality for tenants

    // const plots = data
    //     .map((house) => {
    //         let plotObj = {};
    //         plotObj.plot = house.plotNumber;
    //         plotObj.id = house.id;
    //         return plotObj;
    //     })
    //     .sort((a, b) => a.plot - b.plot);


    let plots = [];
    for (let i = 0; i < 66; i++) {
        plots.push(i + 1);
    }

    // console.log('Plots: ', plots);

    const plotOneHouses = data.filter(house => house.plotNumber === 1);

    let finessedPlots = [];

    // TODO: Remove the redundant plots
    // for (let i = 0; i < plots.length; i++) {
    //     if (plots[i].plot === plots[i + 1].plot) {
    //         // plots.splice(i + 1, 1);
    //         console.log('Duplicate plot')
    //     }
    //     // finessedPlots.push(plots[i]);
    //     console.log('Plots in loop: ', plots[i].plot);
    // }
    // plots.forEach((plot, index) => {
    //     if (plot.plot === plots[index + 1].plot) {
    //         console.log('Duplicate at ', index + 1);
    //     }
    //     // console.log('Plot: ', plot.plot);
    // })

    // console.log({ finessedPlots });

    const transition = useTransition();
    // const fetcher = useFetcher();
    const submit = useSubmit();

    const formRef = useRef(null);

    function handleSelectChange(event) {
        submit(event.currentTarget, { method: 'post', replace: true });
    }

    const today = new Date().toLocaleDateString();
    // useEffect(() => {
    //     if (!transition.submission) {
    //         formRef.current?.reset();
    //     }
    // }, [transition.submission]);
    return (
        <div className={`max-w-5xl mx-auto ${transition.state === 'loading' ? 'opacity-50' : ''}`}>
            {/* <Select plots={plots} /> */}
            <Heading title='Tenants' />
            <div className="flex justify-end">
                <Link to="new-entry" className=" rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 inline-flex items-center gap-2">
                    <PlusIcon className="w-5 h-5 inline" /> Add Tenant
                </Link>
            </div>

            <div className="mt-4 space-y-5">

                {
                    plotOneHouses.length === 0 && !actionData
                        ? <div className="flex flex-col items-center">
                            <div className="w-40 h-40">
                                <img src="/space.svg" alt="A handcraft illustration of space" className="w-full h-full" />

                            </div>
                            <span className="text-center font-semibold">No houses yet</span>
                        </div>
                        : (
                            <>
                                <Form method="post" ref={formRef} onChange={handleSelectChange}>
                                    <label htmlFor="plot">Select plot</label>
                                    <input type="hidden" name="_action" value="selectPlot" />
                                    <select
                                        name="plot"
                                        id="plot"
                                        className="w-20 h-7 px-2 ml-3 bg-[#f8f8ff] border border-[#c0c0c0] rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        {/* {plots.map((plot) => (
                                            <option key={plot.id} value={plot.plot}>{plot.plot}</option>
                                        ))} */}
                                        {
                                            plots.map((plot, index) => (
                                                <option key={index} value={plot}>{plot}</option>
                                            ))
                                        }
                                    </select>
                                </Form>
                                <h1 className="text-lg font-semibold">Plot {actionData ? actionData[0].plotNumber : 1} </h1>
                                <table className="mt-2 border border-slate-400 border-collapse w-full table-auto">
                                    <thead>
                                        <tr className="bg-slate-100">
                                            <th className="border border-slate-300 py-1">
                                                House number
                                            </th>
                                            <th className="border border-slate-300">
                                                Tenant name
                                            </th>
                                            <th className="border border-slate-300">
                                                Phone number
                                            </th>
                                            <th className="border border-slate-300">
                                                Move in date
                                            </th>
                                            <th className="border border-slate-300">
                                                Total arrears
                                            </th>
                                            <th className="border border-slate-300">
                                                Last paid
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {actionData
                                            ? (actionData?.map((house) => (
                                                <TableRow house={house} key={house.id} />
                                            )))
                                            : plotOneHouses.map(house => (
                                                <TableRow house={house} key={house.id} />
                                            ))
                                        }
                                        {/* {fetcher.data
                            ? (fetcher.data?.map((house) => (
                                <TableRow house={house} key={house.id} />
                            )))
                            : data.map(house => (
                                <TableRow house={house} key={house.id} />
                            ))
                        } */}
                                    </tbody>
                                </table>
                            </>
                        )
                }

            </div>
        </div>
    )
}

function TableRow({ house }) {
    return (
        <tr>
            <td className="border border-slate-300 text-center py-2">
                {house.houseNumber}
            </td>
            <td className="border border-slate-300 text-center ">
                <Link
                    to={house.tenantId}
                    className="hover:underline hover:text-blue-500"
                >
                    {house.tenant.name}
                </Link>
            </td>
            <td className="border border-slate-300 text-center">
                {house.tenant.mobile}
            </td>
            <td className="border border-slate-300 text-center">
                {new Date(house.tenant.moveInDate).toLocaleDateString()}
            </td>
            <td className="border border-slate-300 text-center">
                {house.tenant.arrears}
            </td>
            <td className="border border-slate-300 text-center">
                30/7/2022
            </td>
        </tr>
    );
}

// function Select({ plots }) {
//     const fetcher = useFetcher();
//     function handleSelectChange(event) {
//         fetcher.submit(event.currentTarget, { method: 'post', replace: true });
//     }

//     const formRef = useRef(null);
//     return (
//         <fetcher.Form method="post" ref={formRef} onChange={handleSelectChange}>
//             <label htmlFor="plot">Select plot</label>
//             <input type="hidden" name="_action" value="selectPlot" />
//             <select
//                 name="plot"
//                 id="plot"
//                 // onChange={handleSelectChange}
//                 className="w-16 h-7 px-2 ml-3 bg-[#f8f8ff] border border-[#c0c0c0] rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             >
//                 {plots.map((plot) => (
//                     <option key={plot.id} value={plot.plot}>{plot.plot}</option>
//                 ))}
//             </select>
//         </fetcher.Form>
//     )
// }

export function CatchBoundary() {
    const caught = useCatch();
    return (
        <div>
            <p className="font-bold text-xl">Error!</p>
            <p>Status {caught.status}</p>
            <pre>
                <code className="font-semibold">
                    {caught.data}
                </code>
            </pre>
            <div className="flex gap-5">
                <Link to="/dashboard/plots" className="text-blue-500 underline">
                    <ArrowLeftIcon className="w-5 h-5 inline" /> Back to tenants
                </Link>
                <Link to="new-entry" className="text-blue-500 underline">
                    Create new tenant
                </Link>
            </div>
        </div>
    )

}

export function ErrorBoundary() {
    return (
        <div>
            Oops!! No tenants found
        </div>
    )
}