import { Link, useCatch, useLoaderData } from "@remix-run/react";
import Heading from "../../../components/Heading";
import TableHeader from "../../../components/TableHeader";
import TableRow from "../../../components/TableRow";
import { getAdvances } from "../../../models/advance.server";

export function meta() {
    return {
        title: 'Advances | White House Court',
        // description: 'Register as a White House Court tenant'
    };
}

export async function loader() {
    const advances = await getAdvances();
    const tableDataObj = advances.map((advance, index) => {
        let advanceObj = {};
        advanceObj.employeeId = index + 1;
        advanceObj.name = advance.Employee.name;
        advanceObj.phone = advance.Employee.mobile;
        advanceObj.amount = advance.amount;
        advanceObj.dateIssued = new Date(advance.createdAt).toLocaleDateString();

        return advanceObj;
    });
    const tableData = tableDataObj.map((advance) => {
        return Object.values(advance);
    });


    return tableData;
}

export default function Advances() {
    const data = useLoaderData();
    const tableHeadings = ['Employee ID', 'Name', 'Phone number', 'Amount', 'Date Issued',];
    // console.log({ data });
    return (
        <div className="space-y-4 max-w-5xl mx-auto pr-10 lg:pr-0">
            <Heading title='Advances' />
            <div className="flex justify-end">
                <Link to="new-entry" className=" rounded bg-blue-500 w-4/5 sm:w-1/2 lg:w-auto mx-auto lg:mx-0 justify-center py-2 px-2 lg:px-4 text-sm lg:text-base text-white hover:bg-blue-600 focus:bg-blue-400 inline-flex items-center gap-2">
                    Give advance
                </Link>
            </div>
            {
                data.length === 0
                    ? <div className="flex flex-col items-center">
                        <div className="w-20 h-20 lg:w-40 lg:h-40">
                            <img src="/space.svg" alt="A handcraft illustration of space" className="w-full h-full" />

                        </div>
                        <span className="text-center font-semibold">No advances yet</span>
                    </div>
                    : (
                        <div className="max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-none overflow-x-auto">
                            <table className="mt-2 border border-slate-400 border-collapse w-full table-auto">
                                <thead>
                                    <TableHeader tableHeadings={tableHeadings} />
                                </thead>
                                <tbody>
                                    {
                                        data.map((data, index) => (
                                            <TableRow tableData={data} key={index} />
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    )
            }
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