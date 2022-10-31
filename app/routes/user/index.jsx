import { ArrowLeftIcon } from "@heroicons/react/outline";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useCatch, useLoaderData, useSubmit, useTransition } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import toastStyles from "react-toastify/dist/ReactToastify.css";
import TableHeader from "../../components/TableHeader";
import TableRow from "../../components/TableRow";
import { getHouse } from "../../models/house.server";
import { getTenantByEmail } from "../../models/tenant.server";
import { getSession, requireUser, sessionStorage } from "../../session.server";

export function links() {
    return [
        {
            rel: "stylesheet",
            href: toastStyles
        }
    ];
}

export async function loader({ request }) {
    const user = await requireUser(request);
    console.log({ user });
    if (!user) {
        return redirect('/login');
    }
    const session = await getSession(request);
    const successStatus = session.get('success');
    console.log({ successStatus });
    const userEmail = user.email;
    const tenant = await getTenantByEmail(userEmail);
    // console.log({ tenant });
    if (!tenant) {
        throw new Response('User details not found!', {
            status: 404
        });
    }
    return json({ tenant, successStatus }, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}

export async function action({ request, params }) {
    const formData = await request.formData();
    const selectedYear = formData.get('year');

    const plotNo = params.plot.trim();
    const houseNo = params.house.trim();

    console.log('Year from action: ', selectedYear);
    // Get specific year details from db
    const house = await getHouse(plotNo, houseNo);

    const years = house.years;
    // console.log('Years from action: ', years);
    // Compare year from the action with year from the database
    const matchedYear = years.find(year => year.year === Number(selectedYear));
    console.log('Matched year: ', matchedYear);
    const months = Object.entries(matchedYear).slice(2, 14);
    console.log('Months from action: ', months);
    return months;
}

export default function UserIndex() {
    const actionData = useActionData();
    const data = useLoaderData();
    const transition = useTransition();
    const toastId = useRef(null);
    const formRef = useRef(null);

    // console.log('House: ', data);
    const months = Object.entries(data.tenant.years[0]).slice(2, 14);
    console.log({ months });
    const years = data.tenant.years.map(year => {
        let yearObj = {};
        yearObj.year = year.year,
            yearObj.id = year.id
        return yearObj;
    });
    // console.log({ years });

    const submit = useSubmit();
    function handleYearChange(event) {
        submit(event.currentTarget, { replace: true })
    }

    const transactionDetails = [
        ['1', 'MPESA', '100', '1/1/2022'],
        ['2', 'MPESA', '300', '28/8/2022']
    ];
    function success() {
        toastId.current = toast.success('Payment successful!', {
            position: toast.POSITION.BOTTOM_RIGHT
        });
    }

    // useEffect(() => {
    //     formRef.current?.reset();
    // }, [transition.submission]);

    useEffect(() => {
        if (data.successStatus === true) {
            success();
        }
        return () => {
            toast.dismiss(toastId.current)
        }
    }, [data]);
    return (
        <div className="py-4">
            <h1 className="font-bold text-xl lg:text-3xl">User profile</h1>
            <div className="flex gap-5 mt-3">
                <div className="basis-1/2 border border-slate-200 px-3 py-2 rounded-lg space-y-4">
                    {/* Details and payment history */}
                    <div className="text-gray-800">
                        <h2 className="font-semibold text-gray-900 text-lg">Personal info</h2>
                        <TenantDetail name="Name" value={data.tenant.name} />
                        <TenantDetail name="Phone" value={data.tenant.mobile} />
                        <TenantDetail name="Arrears" value={`Ksh ${data.tenant.arrears}`} />
                        <TenantDetail name="Plot No" value={data.tenant.house.plotNumber} />
                        <TenantDetail name="House No" value={data.tenant.house.houseNumber} />
                    </div>

                    <div className="flex justify-center">
                        <Link to="payment" className=" rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 inline-flex items-center gap-2">
                            {/* <PlusIcon className="w-5 h-5 inline" />  */}
                            Make payment
                        </Link>
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
                                <div key={index} className={`border border-slate-100 grid place-items-center h-12 ${month[1] !== null ? 'bg-green-500 text-white' : month[1] === 'not paid' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>
                                    {month[0].charAt(0).toUpperCase() + month[0].slice(1)}
                                </div>
                            ))
                            :
                            months.map((month, index) => (
                                <div key={index} className={`border border-slate-100 grid place-items-center h-12 ${month[1] >= 200
                                    ? 'bg-green-500 text-white'
                                    : month[1] === 0
                                        ? 'bg-red-500 text-white'
                                        : (month[1] > 0 && month[1] < 200)
                                            ? 'bg-orange-200 text-black'
                                            : 'bg-gray-200'
                                    }`

                                }>
                                    {month[0].charAt(0).toUpperCase() + month[0].slice(1)}
                                </div>
                            ))}
                    </div>
                    <p className="text-gray-500 italic">
                        Excess payments will be used to clear arrears.The earliest arrears will be cleared first.
                    </p>
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
            <div className="text-light-black">
                <h2 className="font-semibold text-gray-900">Key</h2>
                <div className="flex gap-5">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-500 w-20 h-8"></div>
                        <span>Month is fully paid</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-200 w-20 h-8 gap-3"></div>
                        <span>Month is partially paid</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-red-500 w-20 h-8"></div>
                        <span>Month is not paid</span>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

function TenantDetail({ name, value }) {
    return (
        <p>{name}: &nbsp; <span className="text-light-black">{value}</span> </p>
    );
}

export function CatchBoundary() {
    const caught = useCatch();
    return (
        <div>
            <p className="font-bold text-lg">Error!</p>
            <p>Status {caught.status}</p>
            <pre>
                <code className="font-semibold">
                    {caught.data}
                </code>
            </pre>
            <Link to="." className="text-blue-500 underline">
                {/* <ArrowLeftIcon className="w-5 h-5 inline" /> Back to tenants */}
                Refresh
            </Link>
        </div>
    )
}

export function ErrorBoundary() {
    return (
        <div>
            Oops!! Can't find your details!
        </div>
    )
}
