import { Link, useCatch, useLoaderData } from "@remix-run/react";
import Heading from "../../../components/Heading";
import TableHeader from "../../../components/TableHeader";
import TableRow from "../../../components/TableRow";
import { getSalaries } from "../../../models/salary.server";

export function meta() {
    return {
        title: 'Salaries | White House Court',
        // description: 'Register as a White House Court tenant'
    };
}

export async function loader() {
    const employeePayments = await getSalaries();
    // console.log({ employeePayments });
    const employeePaymentsObj = employeePayments.map((payment, index) => {
        let paymentObj = {};

        paymentObj.employeeId = index + 1;
        paymentObj.name = payment.Employee.name;
        paymentObj.phone = payment.Employee.mobile;
        paymentObj.amount = payment.amount;
        paymentObj.dateIssued = new Date(payment.createdAt).toLocaleDateString();

        return paymentObj;
    });
    const tableData = employeePaymentsObj.map(payment => {
        return Object.values(payment);
    });
    return tableData;
}
export default function EmployeeDetails() {
    const data = useLoaderData();
    const tableHeadings = ['Employee ID', 'Name', 'Phone number', 'Amount', 'Date Issued'];

    return (
        <div className="space-y-4 max-w-5xl mx-auto pr-10 lg:pr-0">
            <Heading title='Employee payments' />
            <div className="flex justify-end">
                <Link to="new-entry" className=" rounded bg-blue-500 w-4/5 sm:w-1/2 lg:w-auto mx-auto lg:mx-0 justify-center py-2 px-2 lg:px-4 text-sm lg:text-base text-white hover:bg-blue-600 focus:bg-blue-400 inline-flex items-center gap-2">
                    Make payment
                </Link>
            </div>
            {
                data.length === 0
                    ? <div className="flex flex-col items-center">
                        <div className="w-20 h-20 lg:w-40 lg:h-40">
                            <img src="/space.svg" alt="A handcraft illustration of space" className="w-full h-full" />

                        </div>
                        <span className="text-center font-semibold">No employee payments yet</span>
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

            {/* <Dialog isOpen={showDialog} onDismiss={close}>
                <button className="close-button" onClick={close}>
                    <VisuallyHidden>Close</VisuallyHidden>
                    <span aria-hidden>X</span>
                </button>
                <p>This is a dialog content</p>

                <button type="submit" form="delete">Delete</button>

            </Dialog> */}
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