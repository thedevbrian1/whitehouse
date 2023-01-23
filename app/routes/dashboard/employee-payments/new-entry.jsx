import { ArrowLeftIcon } from "@heroicons/react/outline";
import { Link, Outlet } from "@remix-run/react";
import { EmployeeCombobox } from "~/routes/resources/employees";
import Heading from "../../../components/Heading";

export default function PayInFull() {
    return (
        <div className="space-y-4">
            <Link to="/dashboard/employee-payments" className="text-black hover:underline hover:text-blue-500">
                <ArrowLeftIcon className="w-5 h-5 inline" /> Back to employee payments
            </Link>
            <Heading title='Pay in full' />
            <div className="grid lg:grid-cols-2 gap-x-5 max-w-md lg:max-w-5xl lg:pr-20">
                <div className="space-y-4">
                    <h2 className=" text-light-black text-lg font-semibold">Select an employee to pay in full</h2>

                    <EmployeeCombobox />
                </div>
                <div className="w-full border border-slate-200 px-3 py-3 rounded-lg">
                    {/* Employee details */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
