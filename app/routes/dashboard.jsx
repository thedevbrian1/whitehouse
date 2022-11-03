import { Form, Link, NavLink, Outlet, useCatch, useLoaderData, useTransition } from "@remix-run/react";
import { ChartBarIcon, HomeIcon, UsersIcon, NewspaperIcon, TicketIcon } from "@heroicons/react/outline";
// import { redirect } from "@remix-run/node";
import { requireAdminUser } from "../session.server";
import { getTenantByEmail } from "../models/tenant.server";

export function meta() {
    return {
        title: 'Dashboard | White House Court',
        // description: 'Register as a White House Court tenant'
    };
}

export async function loader({ request }) {
    const adminUser = await requireAdminUser(request);
    const adminUserEmail = adminUser.email;
    const tenant = await getTenantByEmail(adminUserEmail);
    if (!tenant) {
        throw new Response('User not found', {
            status: 404
        });
    }
    return tenant.name;
}
// TODO: Add search functionality (for names, plot & house nos)
export default function Dashboard() {
    const data = useLoaderData();
    const transition = useTransition();

    return (
        <div className="h-full divide-solid divide-y">

            <header className="flex py-[14px]">
                <div className="w-14 lg:w-72 bg-[#F8F8F8] fixed z-10 items-center flex justify-between px-3">
                    <div className="w-5 h-5">
                        <img
                            src="/W.svg"
                            alt="W"
                            className="w-full h-full"
                        />
                    </div>
                    <span className="hidden lg:inline font-semibold">White House</span>
                </div>
                <div className="lg:px-6 relative z-10 ml-14 lg:ml-72 flex items-center justify-end  w-full gap-x-4 lg:gap-x-12 text-sm lg:text-base">
                    <span>{new Date().toLocaleDateString()}</span>
                    <span>Hi {data}</span>
                    <Form action="/logout" method="post">
                        <button
                            type="submit"
                            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
                        >
                            Logout
                        </button>
                    </Form>
                </div>
                {/* <div className="border border-slate-200 w-72 h-44 absolute right-3 top-14">

                </div> */}
            </header>
            <main className="flex h-full">
                <div className="h-full fixed top-0 left-0 w-14 lg:w-72 bg-[#F8F8F8] pt-20 pl-4">
                    <ul className="divide-solid divide-y border-t -mt-3">
                        <li className="h-12 ">
                            <NavLink
                                to="/dashboard"
                                prefetch="intent"
                                className={({ isActive }) => isActive ? 'text-blue-600 bg-white  h-full pl-1 flex items-center' : 'h-full pl-1 flex items-center'} end>
                                <ChartBarIcon className="w-5 h-5 inline" /> <span className="ml-2 hidden lg:inline">Dashboard</span>
                            </NavLink>
                        </li>
                        <li className="h-12">
                            <NavLink
                                to="plots"
                                prefetch="intent"
                                className={({ isActive }) => isActive ? 'text-blue-600 bg-white  h-full pl-1 flex items-center' : 'h-full pl-1 flex items-center'}>
                                <HomeIcon className="w-5 h-5 inline" /> <span className="ml-2 hidden lg:inline">Tenants</span>
                            </NavLink>
                        </li>
                        <li className="h-12">
                            <NavLink
                                to="employees"
                                prefetch="intent"
                                className={({ isActive }) => isActive ? 'text-blue-600 bg-white  h-full pl-1 flex items-center' : 'h-full pl-1 flex items-center'}
                            >
                                <UsersIcon className="w-5 h-5 inline" /> <span className="ml-2 hidden lg:inline">Employees</span>
                            </NavLink>
                        </li>
                        {/* <li className="h-12">
                            <NavLink
                                to="payroll"
                                prefetch="intent"
                                className={({ isActive }) => isActive ? 'text-blue-600 bg-white  h-full pl-1 flex items-center' : 'h-full pl-1 flex items-center'}
                            >
                                <CashIcon className="w-5 h-5 inline" /> <span className="ml-2">Payroll</span>
                            </NavLink>
                        </li> */}
                        <li className="h-12">
                            <NavLink
                                to="advances"
                                prefetch="intent"
                                className={({ isActive }) => isActive ? 'text-blue-600 bg-white  h-full pl-1 flex items-center' : 'h-full pl-1 flex items-center'}
                            >
                                <NewspaperIcon className="w-5 h-5 inline" /> <span className="ml-2 hidden lg:inline">Advances</span>
                            </NavLink>
                        </li>
                        <li className="h-12">
                            <NavLink
                                to="employee-payments"
                                prefetch="intent"
                                className={({ isActive }) => isActive ? 'text-blue-600 bg-white  h-full pl-1 flex items-center' : 'h-full pl-1 flex items-center'}
                            >
                                <TicketIcon className="w-5 h-5 inline" /> <span className="ml-2 hidden lg:inline">Employee payments</span>
                            </NavLink>
                        </li>
                        <li className="h-12">
                            <NavLink
                                to="cash-payment"
                                prefetch="intent"
                                className={({ isActive }) => isActive ? 'text-blue-600 bg-white  h-full pl-1 flex items-center' : 'h-full pl-1 flex items-center'}
                            >
                                <TicketIcon className="w-5 h-5 inline" /> <span className="ml-2 hidden lg:inline">Tenant cash payment</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <div className={`flex-1 ml-14 lg:ml-72 px-6 pt-4 ${transition.state === 'loading' ? 'opacity-50' : ''}`}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export function CatchBoundary() {
    const caught = useCatch();
    return (
        <div className="text-black h-screen grid place-items-center">
            <div>
                <h1 className="font-bold text-3xl">Error!</h1>
                <p>Status: {caught.status}</p>
                <pre>
                    <code>{caught.data}</code>
                </pre>
                <Link to="/login" className="text-blue-500 underline">Back to login</Link>
            </div>
        </div>
    );
}

export function ErrorBoundary({ error }) {
    return (
        <div className="text-black">
            <h1 className="font-bold text-3xl">Error!</h1>
            <p>{error.message}</p>
            <p>The stack trace is:</p>
            <p>{error.stack}</p>
            <Link to="/login" className="text-blue-500 underline">Back to login</Link>
        </div>
    )
}