import { ArrowLeftIcon } from "@heroicons/react/outline";
import { Form, Link, useActionData, useCatch, useLoaderData, useSubmit } from "@remix-run/react";
import { getHouse } from "../../../models/house.server";
import TableHeader from "../../../components/TableHeader";
import TableRow from "../../../components/TableRow";
import { getTenant } from "../../../models/tenant.server";

export async function loader({ params }) {
    const tenantId = params.id;
    const tenant = await getTenant(tenantId);
    // console.log({ tenant });
    if (!tenant) {
        throw new Response('Tenant details not found!', {
            status: 404
        });
    }

    return tenant;
}

export async function action({ request, params }) {
    const formData = await request.formData();
    const selectedYear = formData.get('year');

    const plotNo = params.plot.trim();
    const houseNo = params.house.trim();

    // console.log('Year from action: ', selectedYear);

    // Get specific year details from db
    const house = await getHouse(plotNo, houseNo);
    const years = house.years;

    // console.log('Years from action: ', years);
    // Compare year from the action with year from the database
    const matchedYear = years.find(year => year.year === Number(selectedYear));

    // console.log('Matched year: ', matchedYear);

    const months = Object.entries(matchedYear).slice(2, 14);

    // console.log('Months from action: ', months);

    return months;
}

export function meta({ data }) {
    return {
        title: `${data.name} House ${data.house.plotNumber} / ${data.house.houseNumber} | White House Court`
    };
}

export default function House() {
    const actionData = useActionData();
    const data = useLoaderData();

    const months = Object.entries(data.years[0]).slice(2, 14);
    const years = data.years.map(year => {
        return { year: year.year, id: year.id }
    });

    const submit = useSubmit();
    function handleYearChange(event) {
        submit(event.currentTarget, { replace: true })
    }

    const transactionDetails = [
        ['1', 'MPESA', '100', '1/1/2022'],
        ['2', 'MPESA', '300', '28/8/2022']
    ];

    return (
        <div>
            <Link to=".." className="text-black hover:underline hover:text-blue-500">
                <ArrowLeftIcon className="w-5 h-5 inline" /> Back to tenants
            </Link>
            <h1 className="font-bold text-2xl mt-3">House {`${data.house.plotNumber} / ${data.house.houseNumber}`}</h1>
            <div className="flex gap-5 mt-3">
                <div className="basis-1/2 border border-slate-200 px-3 py-2 rounded-lg">
                    {/* Details and payment history */}
                    <div className="text-gray-900">
                        <TenantDetail name="Tenant" value={data.name} />
                        <TenantDetail name="Phone" value={data.mobile} />
                        <TenantDetail name="Arrears" value={`Ksh ${data.arrears}`} />
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between">
                            <h2 className="font-bold text-gray-900 text-lg">Payment history</h2>
                            <Form method="post" onChange={handleYearChange}>
                                <label htmlFor="year">Year:</label>
                                <select
                                    name="year"
                                    id="year"
                                    className="w-20 h-7 px-2 ml-3 bg-[#f8f8ff] border border-[#c0c0c0] rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    {years.map(year => (
                                        <option value={year.year} key={year.id}>{year.year}</option>
                                    ))}
                                </select>
                            </Form>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                        {actionData
                            ? actionData?.map((month, index) => (
                                <div key={index} className={`border border-slate-100 grid place-items-center h-12 ${month[1] === 'paid' ? 'bg-green-500 text-white' : month[1] === 'not paid' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>
                                    {month[0].charAt(0).toUpperCase() + month[0].slice(1)}
                                </div>
                            ))
                            :
                            months.map((month, index) => (
                                <div key={index} className={`border border-slate-100 grid place-items-center h-12 ${month[1] >= 200
                                    ? 'bg-green-500 text-white'
                                    : (month[1] > 0 && month[1] < 200)
                                        ? 'bg-orange-200'
                                        : month[1] === 0
                                            ? 'bg-red-500 text-white'
                                            : 'bg-gray-200'}`}>
                                    {month[0].charAt(0).toUpperCase() + month[0].slice(1)}
                                </div>
                            ))}
                    </div>
                </div>
                <div className="basis-1/2 border border-slate-200 px-3 py-2 rounded-lg">
                    {/* Transaction history */}
                    <h2 className="font-bold text-gray-900 text-lg">Transaction history</h2>
                    <table className="w-full mt-4">
                        <thead>
                            <TableHeader tableHeadings={['Number', 'Type', 'Amount', 'Date']} />
                        </thead>
                        <tbody>
                            {
                                transactionDetails.map((transaction, index) => (
                                    <TableRow tableData={transaction} key={index} />
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function TenantDetail({ name, value }) {
    return (
        <p className="mt-2"><span className="font-semibold">{name}:</span> &nbsp; <span className="text-gray-800">{value}</span></p>
    );
}

export function CatchBoundary() {
    const caught = useCatch();
    return (
        <div>
            <p>Error!</p>
            <p>Status {caught.status}</p>
            <pre>
                <code>
                    {caught.data}
                </code>
            </pre>
            <Link to="/dashboard/plots" className="text-blue-500 underline">
                <ArrowLeftIcon className="w-5 h-5 inline" /> Back to tenants
            </Link>
        </div>
    );
}

export function ErrorBoundary({ error }) {
    return (
        <div>
            Oops! Error fetching tenant details.
        </div>
    )
}