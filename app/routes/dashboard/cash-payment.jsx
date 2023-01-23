import { Outlet, useCatch } from "@remix-run/react";
import { useEffect, useRef } from "react";
import Heading from "../../components/Heading";
import { TenantCombobox } from "../resources/tenants";

export function meta() {
    return {
        title: 'Tenant cash payment | White House Court',
        // description: 'Register as a White House Court tenant'
    };
}


export async function loader() {
    return null;
}

export default function CashPayment() {
    const searchRef = useRef(null);

    useEffect(() => {
        searchRef.current?.focus
    }, []);
    return (
        <div className="space-y-4">
            <Heading title='Tenant cash payment' />
            <div className="grid lg:grid-cols-2 gap-x-5 max-w-md lg:max-w-5xl lg:pr-20">
                <div className="space-y-4">
                    <h2 className=" text-light-black text-lg mb-2 font-semibold">Select a tenant to record cash payment</h2>

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
        <div>
            <h1>Error!</h1>
            <pre>
                <code>
                    Status {caught.status}
                </code>
            </pre>
            <p>{caught.data}</p>
        </div>
    );
}

// TODO: Insert error to logfile
export function ErrorBoundary({ error }) {
    console.error(error);
    return (
        <div>
            <h1 className="font-bold text-lg">Error</h1>
            <p>{error.message}</p>
        </div>
    )
}