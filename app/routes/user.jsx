import { CashIcon, HomeIcon } from "@heroicons/react/outline";
import { Form, Link, NavLink, Outlet, useCatch, useLoaderData } from "@remix-run/react";
import { getTenantByEmail } from "../models/tenant.server";
import { requireUser } from "../session.server";

export function meta() {
    return {
        title: `Account | White House court`
    };
}

export async function loader({ request }) {
    const user = await requireUser(request);
    // console.log({ user });
    const userEmail = user.email;
    const tenant = await getTenantByEmail(userEmail);
    // console.log({ tenant });
    // if (!tenant) {
    //     throw new Response('User details not found!', {
    //         status: 404
    //     });
    // }
    return tenant.name;
    // return 'Briana'
}

export default function UserPage() {
    const data = useLoaderData();
    return (
        <div className="h-full divide-solid divide-y">

            <header className="flex py-[14px]">
                <div className="w-14 lg:w-72 bg-[#F8F8F8] fixed z-10 flex justify-between px-5">
                    {/* <span>Logo</span> */}
                    <div className="w-5 h-5">
                        <img
                            src="/W.svg"
                            alt="W"
                            className="w-full h-full"
                        />
                    </div>
                    <span className="hidden lg:inline font-semibold">White House</span>
                </div>
                <div className="lg:px-6 relative z-10 ml-14 lg:ml-72 flex justify-end items-center w-full  gap-x-4 lg:gap-x-12 ">
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
                <div className="h-full fixed top-0 left-0 w-14 lg:w-72 bg-[#F8F8F8] pt-20 pl-2 lg:pl-4">
                    <ul className="divide-solid divide-y border-t -mt-3">
                        <li className="h-12">
                            <NavLink
                                to="/user"
                                prefetch="intent"
                                className={({ isActive }) => isActive ? 'text-blue-600 bg-white  h-full pl-1 flex items-center' : 'h-full pl-1 flex items-center'}
                                end
                            >
                                <HomeIcon className="w-5 h-5 inline" /> <span className="ml-2 hidden lg:inline">Home</span>
                            </NavLink>
                        </li>

                        <li className="h-12">
                            <NavLink
                                to="payment"
                                prefetch="intent"
                                className={({ isActive }) => isActive ? 'text-blue-600 bg-white  h-full pl-1 flex items-center' : 'h-full pl-1 flex items-center'}
                                end
                            >
                                <CashIcon className="w-5 h-5 inline" /> <span className="ml-2 hidden lg:inline">Make payment</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <div className="flex-1 ml-14 lg:ml-72 px-6 pt-4">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export function CatchBoundary() {
    const caught = useCatch();
    return (
        <div>
            <h1 className="font-bold text-lg">Error!</h1>
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

export function ErrorBoundary({ error }) {
    return (
        <div>
            <h1 className="font-bold text-lg">Oops!!</h1>
            <p>{error.message}</p>
        </div>
    )
}