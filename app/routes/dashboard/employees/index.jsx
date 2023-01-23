import { PlusIcon } from "@heroicons/react/outline";
import { Link, useLoaderData } from "@remix-run/react";
import { toast, ToastContainer } from "react-toastify";
import toastStyles from "react-toastify/dist/ReactToastify.css";
import TableHeader from "../../../components/TableHeader";
import TableRow from "../../../components/TableRow";
import Heading from "../../../components/Heading";
import { getEmployees } from "../../../models/employee.server";
import { getSession, sessionStorage } from "~/session.server";
import { json } from "@remix-run/server-runtime";
import { useEffect, useRef } from "react";

export function links() {
    return [
        {
            rel: "stylesheet",
            href: toastStyles
        }
    ];
}

export async function loader({ request }) {
    const employees = await getEmployees();
    const session = await getSession(request);
    const successStatus = session.get('success');

    if (successStatus) {
        return json({ employees, success: true }, {
            headers: {
                "Set-Cookie": await sessionStorage.commitSession(session)
            }
        })
    }
    return json({ employees }, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}

export default function EmployeesIndex() {
    const data = useLoaderData();
    const toastId = useRef(null);

    const tableHeadings = ['Employee ID', 'Name', 'Phone number', 'Email', , 'National Id', 'Salary'];
    const tableData = data.employees.map((employee) => {
        return Object.values(employee).slice(1, 6)
    });

    tableData.forEach((employee, index) => employee.splice(0, 0, index + 1));

    function success() {
        toastId.current = toast.success('Employee added successfully!', {
            position: toast.POSITION.BOTTOM_RIGHT
        });
    }

    useEffect(() => {
        if (data.success === true) {
            success();
        }

        return () => {
            toast.dismiss(toastId.current)
        }
    }, [data.success]);

    return (
        <div className="space-y-4 lg:max-w-5xl mx-auto pr-10 lg:pr-0">
            <Heading title='Employees' />
            <div className="flex justify-end">
                <Link to="new-entry" className=" rounded bg-blue-500  w-4/5 sm:w-1/2 lg:w-auto mx-auto lg:mx-0 justify-center py-2 px-2 lg:px-4 text-sm lg:text-base text-white hover:bg-blue-600 focus:bg-blue-400 inline-flex items-center gap-2">
                    <PlusIcon className="w-5 h-5 inline" /> Add employee
                </Link>
            </div>
            {
                tableData.length === 0
                    ? <div className="flex flex-col items-center">
                        <div className="w-20 h-20 lg:w-40 lg:h-40">
                            <img src="/space.svg" alt="A handcraft illustration of space" className="w-full h-full" />

                        </div>
                        <span className="text-center font-semibold">No employees yet</span>
                    </div>
                    : (
                        <div className="max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-none overflow-x-auto">
                            <table className="mt-2 border border-slate-400 border-collapse w-full table-auto">
                                <thead>
                                    <TableHeader tableHeadings={tableHeadings} />
                                </thead>
                                <tbody>
                                    {
                                        tableData.map((data, index) => (
                                            <TableRow tableData={data} key={index} />
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    )
            }
            <ToastContainer />
        </div>
    );
}