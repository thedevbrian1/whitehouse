import { Link, useLoaderData } from "@remix-run/react";
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
    console.log({ employeePayments });
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
        <div className="space-y-5 max-w-5xl mx-auto">
            <Heading title='Employee payments' />
            <div className="flex justify-end">
                <Link to="new-entry" className=" rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 inline-flex items-center gap-2">
                    Make payment
                </Link>
            </div>
            {
                data.length === 0
                    ? <div className="flex flex-col items-center">
                        <div className="w-40 h-40">
                            <img src="/space.svg" alt="A handcraft illustration of space" className="w-full h-full" />

                        </div>
                        <span className="text-center font-semibold">No employee payments yet</span>
                    </div>
                    : (
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