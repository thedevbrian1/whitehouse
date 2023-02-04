import { Link, Outlet, useCatch } from "@remix-run/react";
import { useEffect, useRef } from "react";
import Heading from "../../components/Heading";
import { TenantCombobox } from "../resources/tenants";

export function meta() {
    return {
        title: 'Tenant cash payment | White House Court',
        // description: 'Register as a White House Court tenant'
    };
}

export default function CashPayment() {
    const searchRef = useRef(null);

    useEffect(() => {
        searchRef.current?.focus
    }, []);
    return (
        <div className="space-y-4">
            <Heading title='Tenant cash payment' />
            <div className="grid lg:grid-cols-2 gap-5 max-w-md lg:max-w-5xl lg:pr-20">
                <div className="space-y-4">
                    <h2 className=" text-light-black text-lg mb-2 font-semibold">Select a tenant to record cash payment</h2>
                    {/* TODO: Fix mobile responsivenness */}
                    <TenantCombobox />
                </div>
                <div className="w-full border border-slate-200 px-3 py-3 rounded-lg">
                    {/* Employee details */}
                    <Outlet />
                </div>
            </div>

        </div>
    );
}


export function CatchBoundary() {
    const caught = useCatch();
    return (
        <div className="w-full h-screen grid justify-center">
            <div className="mt-20">
                <div className="w-20 h-20 lg:w-40 lg:h-40">
                    <img src="/space.svg" alt="A handcraft illustration of space" className="w-full h-full" />

                </div>
                <h1 className="font-bold text-2xl md:text-3xl">Error!</h1>
                <pre>
                    <code>
                        Status {caught.status}
                    </code>
                </pre>
                <p className="font-semibold mb-4">{caught.data}</p>
                <Link to="." className="text-blue-500 hover:text-blue-400 underline">Try again</Link>
            </div>
        </div>
    );
}

// TODO: Insert error to logfile
export function ErrorBoundary({ error }) {
    console.error(error);
    return (
        <div className="w-full h-screen grid justify-center">
            <div className="mt-20">
                <div className="w-20 h-20 lg:w-40 lg:h-40">
                    <img src="/space.svg" alt="A handcraft illustration of space" className="w-full h-full" />

                </div>
                <h1 className="font-bold text-2xl md:text-3xl">Error!</h1>
                <p className=" mb-4">{error.message}</p>
                <Link to="." className="text-blue-500 hover:text-blue-400 underline">Try again</Link>
            </div>
        </div>
    );
}