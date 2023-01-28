import { Form, Link, useActionData, useCatch, useLoaderData, useTransition } from "@remix-run/react";
import { json, redirect } from "@remix-run/server-runtime";
import { useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import toastStyles from "react-toastify/dist/ReactToastify.css";
import Input from "~/components/Input";
import { getAdvancesById } from "../../../../models/advance.server";
import { getEmployeeByMobile, getEmployees } from "../../../../models/employee.server";
import { createSalaryPayment } from "../../../../models/salary.server";
import { getSession, sessionStorage } from "../../../../session.server";
import { badRequest, validateAmount, validateName, validatePhone } from "../../../../utils";
import { getCurrentTotalAdvance } from "../../advances/new-entry/$id";
import { getTotalCurrentPaidAmount } from "./$id";

export function links() {
    return [
        {
            rel: "stylesheet",
            href: toastStyles
        }
    ];
}

export async function loader({ request }) {
    const session = await getSession(request);
    const successStatus = session.get('success');
    return json({ successStatus }, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}
export async function action({ request }) {
    // throw new Response('Tenant does not exist!', {
    //     status: 404
    // });
    const formData = await request.formData();
    const name = formData.get('name');
    const phone = formData.get('phone');
    const amount = formData.get('amount');

    const fields = {
        name,
        phone,
        amount
    };

    const fieldErrors = {
        name: validateName(name),
        phone: validatePhone(phone),
        amount: validateAmount(amount)
    };

    // Return errors if any

    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fields, fieldErrors });
    }

    // Record payment in the database

    const matchedEmployee = await getEmployeeByMobile(phone);

    // console.log({ matchedEmployee });

    if (!matchedEmployee) {
        throw new Response('Employee does not exist!', {
            status: 400
        });
    }

    if (name !== matchedEmployee.name) {
        throw new Response('Name and phone do not match!', {
            status: 400
        });
    }
    const employeeId = matchedEmployee.id;
    const employeeSalary = matchedEmployee.salary;
    const employeePaidAmount = matchedEmployee.paid;

    // console.log({ employeePaidAmount });

    const totalCurrentPaidAmount = getTotalCurrentPaidAmount(matchedEmployee);
    const totalAdvance = getCurrentTotalAdvance(matchedEmployee);

    const totalPaidAmount = totalCurrentPaidAmount + totalAdvance;

    if (Number(amount) > (employeeSalary - totalAdvance)) {
        throw new Response('Allowed amount exceeded!', {
            status: 400
        });
    }

    if (totalPaidAmount >= employeeSalary) {
        throw new Response(`${matchedEmployee.name} has been fully paid!`, {
            status: 400
        });
    }

    const res = await createSalaryPayment(employeeId, Number(amount));

    // console.log({ res });

    const session = await getSession(request);
    session.flash("success", true);


    return redirect('/dashboard/employee-payments/new-entry', {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}

export default function PayInFullIndex() {
    const data = useLoaderData();
    const actionData = useActionData();
    const transition = useTransition();

    const toastId = useRef(null);
    const formRef = useRef(null);

    function success() {
        toastId.current = toast.success('Payment successful!', {
            position: toast.POSITION.BOTTOM_RIGHT
        });
    }

    useEffect(() => {
        if (!actionData?.fieldErrors) {
            formRef.current?.reset();
        }
    }, [transition.submission]);

    useEffect(() => {
        if (data.successStatus === true) {
            success();
        }
        return () => {
            toast.dismiss(toastId.current)
        }
    }, [data]);

    return (
        <div className="px-3 py-2 space-y-2">
            <h2 className="font-semibold text-lg text-light-black">Enter employee details below</h2>
            <Form method="post" className="" ref={formRef}>
                <fieldset className="space-y-1">
                    <div>
                        <label htmlFor="name" className="text-light-black">
                            Name
                        </label>
                        <Input
                            // ref={nameRef}
                            type="text"
                            name="name"
                            id="name"
                            placeholder='John Doe'
                            fieldError={actionData?.fieldErrors.name}
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="text-light-black">
                            Phone
                        </label>
                        <Input
                            // ref={phoneRef}
                            type="text"
                            name="phone"
                            id="phone"
                            placeholder='0712 345 678' fieldError={actionData?.fieldErrors.phone}
                        />
                    </div>

                    <div>
                        <label htmlFor="amount" className="text-light-black">
                            Amount
                        </label>
                        <Input
                            // ref={salaryRef}
                            type="text"
                            name="amount"
                            id="amount"
                            fieldError={actionData?.fieldErrors.amount}
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 px-6 py-2 text-white text-center w-full rounded focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {transition.submission ? 'Processing...' : 'Pay'}
                    </button>
                </fieldset>
            </Form>
            <ToastContainer />
        </div>
    );
}

export function CatchBoundary() {
    const caught = useCatch();
    return (
        <div>
            <h1 className="font-bold text-lg lg:text-xl">Error!</h1>
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
            <h1 className="font-bold text-lg lg:text-xl">Error!</h1>
            <pre>{error.message}</pre>
        </div>
    )
}