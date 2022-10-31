import { Form, useCatch, useLoaderData, useTransition } from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";
import { getEmployee } from "../../../../models/employee.server";
import { createSalaryPayment } from "../../../../models/salary.server";
import { getSession, sessionStorage } from "../../../../session.server";

export async function loader({ params }) {
    const id = params.id;
    const employee = await getEmployee(id);
    return employee;
}

export async function action({ request }) {
    const formData = await request.formData();
    const employeeId = formData.get('employeeId');

    // Get employee salary from db
    const employee = await getEmployee(employeeId);
    const employeeSalary = employee.salary;

    // Check if there is any advance given
    const employeeAdvances = employee.advance.map((advance) => {
        return advance.amount
    });
    // TODO: Use the current month's advances
    let totalAdvance = 0;
    if (employeeAdvances.length > 0) {
        totalAdvance = employeeAdvances.reduce((prev, current) => prev + current);
    }

    // console.log({ totalAdvance });

    // If there is an advance, subtract it from the salary
    const newSalary = employeeSalary - totalAdvance;

    // Record the remaining amount in the db
    const res = await createSalaryPayment(employeeId, Number(newSalary));

    // console.log({ res });

    const session = await getSession(request);
    session.flash("success", true);

    return redirect('/dashboard/employee-payments/new-entry', {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}
export default function PaymentPersonalDetails() {
    const data = useLoaderData();
    const transition = useTransition();

    // Get amount to be paid (salary - advances)
    const employeeSalary = data.salary;

    // TODO: Use the current month's advances
    const employeeAdvances = data.advance.map((advance) => {
        return advance.amount
    });
    let totalAdvance = 0;
    if (employeeAdvances.length > 0) {
        totalAdvance = employeeAdvances.reduce((prev, current) => prev + current);
    }

    const amountToBePaid = employeeSalary - totalAdvance;

    return (
        <div className="px-3 py-2 space-y-2">
            <h2 className="font-semibold">Employee details</h2>
            <div className="text-gray-800">
                <p>Name: &nbsp; <span className="text-light-black">{data.name}</span></p>
                <p>Phone: &nbsp; <span className="text-light-black">{data.mobile}</span></p>
                <p>National Id: &nbsp; <span className="text-light-black">{data.nationalId}</span></p>
            </div>
            <p className="font-semibold text-light-black">Amount to be paid: <span className="font-bold text-black">{amountToBePaid}</span></p>
            <Form method="post">
                <fieldset>
                    {/* <label htmlFor="amount">Enter amount <i>(Max limit Ksh 10000)</i></label>
                    <input
                        id="amount"
                        type="number"
                        name="amount"
                        className="block w-full px-3 py-2 border border-gray-400 rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {
                        actionData?.amount
                            ? (<span className="pt-1 text-red-700 inline text-sm" id="email-error">
                                {actionData.amount}
                            </span>)
                            : <>&nbsp;</>
                    } */}
                    <input type="hidden" name="employeeId" value={data.id} />
                    <button className="bg-blue-600 px-6 py-2 text-white text-center w-full rounded focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {transition.submission ? 'Processing...' : 'Pay'}
                    </button>
                </fieldset>
            </Form>
        </div>
    );
}

export function CatchBoundary() {
    const caught = useCatch();
    return (
        <div>
            <h1 className="font-bold text-3xl">Error!</h1>
            <p>Status: {caught.status}</p>
            <pre>
                <code>{caught.data}</code>
            </pre>
            <Link to="." className="text-blue-500 underline">
                Try again
            </Link>
        </div>
    );
}

export function ErrorBoundary({ error }) {
    return (
        <div>
            <h1 className="font-bold text-3xl">Error!</h1>
            <pre>{error.message}</pre>
        </div>
    )
}