import { ArrowLeftIcon } from "@heroicons/react/outline";
import { Form, Link, useActionData, useCatch, useLoaderData, useSubmit } from "@remix-run/react";
import { getHouse } from "../../../models/house.server";
import TableHeader from "../../../components/TableHeader";
import TableRow from "../../../components/TableRow";
import { getTenant } from "../../../models/tenant.server";
import Heading from "../../../components/Heading";

export async function loader({ params }) {
    const tenantId = params.id;
    const tenant = await getTenant(tenantId);
    console.log({ tenant });
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
    // console.log({ data });
    const months = Object.entries(data.years).slice(2, 14);

    // COMMENTED OUT FOR NOW
    // const years = data.years.map(year => {
    //     return { year: year.year, id: year.id }
    // });

    const submit = useSubmit();
    function handleYearChange(event) {
        submit(event.currentTarget, { replace: true })
    }

    const transactions = data.transactions.map((transaction) => {
        return Object.values(transaction).slice(1, 4);
    });
    // console.log({ transactions });
    transactions.forEach((transaction, index) => transaction.splice(0, 0, index + 1));
    transactions.forEach((transaction) => transaction.splice(3, 1, new Date(transaction[3]).toDateString()));

    return (
        <div className="w-full space-y-4 lg:max-w-5xl mx-auto pr-10 lg:pr-0">
            <Link to=".." className="text-black hover:underline hover:text-blue-500">
                <ArrowLeftIcon className="w-5 h-5 inline" /> Back to tenants
            </Link>
            {/* <h1 className="font-bold text-2xl mt-3">House {`${data.house.plotNumber} / ${data.house.houseNumber}`}</h1> */}
            <Heading title={`House ${data.house.plotNumber} / ${data.house.houseNumber}`} />
            <div className="flex flex-col lg:flex-row gap-5 mt-3">
                <div className="basis-1/2 border border-slate-200 px-3 py-2 rounded-lg">
                    {/* Details and payment history */}
                    <div className="text-gray-900">
                        <TenantDetail name="Tenant" value={data.name} />
                        <TenantDetail name="Phone" value={data.mobile} />
                        <TenantDetail name="Arrears" value={`Ksh ${data.arrears}`} />
                    </div>
                    <div className="mt-4 py-1">
                        <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row justify-between">
                            <h2 className="font-bold text-gray-900 text-lg">Payment history</h2>
                            <Form method="post" onChange={handleYearChange}>
                                <label htmlFor="year">Select year:</label>
                                <select
                                    name="year"
                                    id="year"
                                    className="w-20 h-7 px-2 ml-3 bg-[#f8f8ff] border border-[#c0c0c0] rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    {/* {years.map(year => (
                                        <option value={year.year} key={year.id}>{year.year}</option>
                                    ))} */}
                                    <option value="2022">2022</option>
                                </select>
                            </Form>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 lg:grid-cols-4  gap-4 mt-4">
                        {actionData
                            ? actionData?.map((month, index) => (
                                <div key={index} className={`border border-slate-100 grid place-items-center h-12 ${month[1] === 'paid' ? 'bg-green-500 text-white' : month[1] === 'not paid' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>
                                    {month[0].charAt(0).toUpperCase() + month[0].slice(1)}
                                </div>
                            ))
                            :
                            months.map((month, index) => (
                                <div key={index} className={`border border-slate-100 grid place-items-center text-xs md:text-sm lg:text-base h-12 px-1 ${month[1] >= 200
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
                    <div className="max-w-xs sm:max-w-2xl lg:max-w-none overflow-x-auto lg:overflow-x-hidden">
                        <table className="w-full mt-4">
                            {
                                transactions.length === 0 ? 'No transactions yet' :
                                    (<>
                                        <thead>
                                            <TableHeader tableHeadings={['Number', 'Type', 'Amount', 'Date']} />
                                        </thead>
                                        <tbody>
                                            {

                                                transactions.map((transaction, index) => (
                                                    <TableRow tableData={transaction} key={index} />
                                                ))
                                            }
                                        </tbody>
                                    </>)
                            }
                        </table>
                    </div>
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