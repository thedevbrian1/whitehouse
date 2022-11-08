import { PlusIcon } from "@heroicons/react/outline";
import { Link, useLoaderData } from "@remix-run/react";
// import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
// import { VisuallyHidden } from "@reach/visually-hidden";
import dialogStyles from "@reach/dialog/styles.css";

import TableHeader from "../../../components/TableHeader";
import TableRow from "../../../components/TableRow";
import Heading from "../../../components/Heading";
import { getEmployees } from "../../../models/employee.server";

export function links() {
    return [
        {
            rel: "stylesheet",
            href: dialogStyles
        }
    ];
}

export async function loader() {
    const employees = await getEmployees();
    return employees;
}

export async function action({ request }) {
    const formData = await request.formData();
    const confirm = formData.get('confirm');
    console.log({ confirm });
    return null;
}

export default function EmployeesIndex() {
    const data = useLoaderData();

    const tableHeadings = ['Employee ID', 'Name', 'Phone number', 'Email', , 'National Id', 'Salary'];
    const tableData = data.map((employee) => {
        return Object.values(employee).slice(1, 6)
    });

    tableData.forEach((employee, index) => employee.splice(0, 0, index + 1));
    console.log({ Employees: tableData });

    // const [showDialog, setShowDialog] = useState(false);

    // function open() {
    //     setShowDialog(true);
    // }

    // function close() {
    //     setShowDialog(false);
    // }
    return (
        <div className="space-y-4 lg:max-w-5xl mx-auto pr-10 lg:pr-0">
            <Heading title='Employees' />
            <div className="flex justify-end">
                <Link to="new-entry" className=" rounded bg-blue-500  w-4/5 md:w-1/2 lg:w-auto mx-auto lg:mx-0 justify-center py-2 px-2 lg:px-4 text-sm lg:text-base text-white hover:bg-blue-600 focus:bg-blue-400 inline-flex items-center gap-2">
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
                        <div className="max-w-xs md:max-w-3xl lg:max-w-none overflow-x-auto">


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

            {/* <Form method="post" id="delete">
                <input type="hidden" name="confirm" value="confirm" />
                <button
                    type="button"
                    className="px-6 py-3 bg-red-500"
                    onClick={open}
                >
                    Delete
                </button>
            </Form> */}
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