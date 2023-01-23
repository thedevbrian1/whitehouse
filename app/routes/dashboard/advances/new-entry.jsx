import { ArrowLeftIcon } from "@heroicons/react/outline";
import { Link, Outlet, useCatch } from "@remix-run/react";
import Heading from "../../../components/Heading";
import { EmployeeCombobox } from "../../resources/employees";



export async function loader() {

    return null;
}
export default function Advance() {
    return (
        <div className="space-y-4">
            <Link to="/dashboard/advances" className="text-black hover:underline hover:text-blue-500">
                <ArrowLeftIcon className="w-5 h-5 inline" /> Back to advances
            </Link>
            <Heading title='Advance' />
            <div className="grid lg:grid-cols-2 gap-x-5 max-w-md lg:max-w-5xl lg:pr-20">
                <div className="space-y-4">
                    <h2 className=" text-light-black text-lg font-semibold">Select an employee to issue an advance</h2>
                    <EmployeeCombobox />
                </div>
                <div className="w-full border border-slate-200 px-3 py-3 rounded-lg">
                    {/* Employee details */}
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export function CatchBoundary() {
    const caught = useCatch();
    return (
        <div>
            <h1 className="font-bold text-lg">Error!</h1>
            <pre>
                <code>
                    Status {caught.status}
                </code>
            </pre>
            <p className="font-semibold">{caught.data}</p>
            <Link to="/dashboard/advances/new-entry" className="text-blue-500 underline">
                Try again
            </Link>
        </div>
    );
}