import { Form, Link, useActionData, useCatch, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/server-runtime";
import { useEffect, useRef, useTransition } from "react";
import { toast, ToastContainer } from "react-toastify";
import toastStyles from "react-toastify/dist/ReactToastify.css";
import Label from "~/components/Label";
import { createAdvance, getAdvancesById } from "../../../../models/advance.server";
import { getEmployees } from "../../../../models/employee.server";
import { getSession, sessionStorage } from "../../../../session.server";
import { badRequest, validateAmount, validateName, validatePhone } from "../../../../utils";
import { getCurrentTotalAdvance } from "./$id";

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

    if (successStatus) {
        return json({ success: true }, {
            headers: {
                "Set-Cookie": await sessionStorage.commitSession(session)
            }
        });
    }
    return json('', {
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

    // const tenants = await getTenants();
    // const matchedTenant = tenants.find(tenant => tenant.mobile === phone);
    // if (!matchedTenant) {
    //     throw new Response('Tenant does not exist!', {
    //         status: 400
    //     });
    // }
    // const tenantId = matchedTenant.id;

    const employees = await getEmployees();
    const matchedEmployee = employees.find(employee => employee.mobile === phone);
    if (!matchedEmployee) {
        throw new Response('Employee does not exist');
    }
    const employeeId = matchedEmployee.id;
    const employeeSalary = matchedEmployee.salary;

    const totalAdvance = getCurrentTotalAdvance(matchedEmployee);

    if ((Number(amount) + totalAdvance) > (0.3 * employeeSalary)) {
        throw new Response('Allowed amount exceeded!', {
            status: 400
        });
    }
    const res = await createAdvance(employeeId, Number(amount));
    // console.log({ res });

    const session = await getSession(request);
    session.flash("success", true);

    return redirect('/dashboard/advances/new-entry', {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}

export default function AdvanceIndex() {
    const data = useLoaderData();
    const actionData = useActionData();
    const transition = useTransition();

    const toastId = useRef(null);
    const formRef = useRef(null);
    // const nameRef = useRef(null);
    // const phoneRef = useRef(null);
    // const amountRef = useRef(null);

    function success() {
        toastId.current = toast.success('Advance payment successful!', {
            position: toast.POSITION.BOTTOM_RIGHT
        });
    }


    useEffect(() => {
        formRef.current?.reset();
    }, [transition.submission]);

    useEffect(() => {
        if (data.success === true) {
            success();
        }

        return () => {
            toast.dismiss(toastId.current)
        }
    }, [data.success]);

    return (
        <div>
            {/* <button onClick={success}>Notify!</button> */}
            <h2 className="text-light-black font-semibold">Enter employee details below</h2>
            <Form method="post" className="" ref={formRef}>
                <fieldset className="space-y-1">
                    <div>
                        <label htmlFor="name" className="text-light-black">
                            Name
                        </label>
                        {/* <Label htmlFor='name' text='Name' /> */}
                        <input
                            // ref={nameRef}
                            type="text"
                            name="name"
                            id="name"
                            defaultValue={actionData?.fields.name}
                            className={`block w-full px-3 py-2 border  rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${actionData?.fieldErrors.name ? 'border-red-700' : 'border-gray-400'}`}
                        />
                        {
                            actionData?.fieldErrors.name
                                ? (<span className="pt-1 text-red-700 inline text-sm" id="email-error">
                                    {actionData.fieldErrors.name}
                                </span>)
                                : <>&nbsp;</>
                        }

                    </div>
                    <div>
                        <label htmlFor="phone" className="text-light-black">
                            Phone
                        </label>
                        {/* <Label htmlFor='phone' text='Phone' /> */}
                        <input
                            // ref={phoneRef}
                            type="text"
                            name="phone"
                            id="phone"
                            defaultValue={actionData?.fields.phone}
                            className={`block w-full px-3 py-2 border rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${actionData?.fieldErrors.phone ? 'border-red-700' : 'border-gray-400'}`}
                        />
                        {
                            actionData?.fieldErrors.phone
                                ? (<span className="pt-1 text-red-700 text-sm" id="email-error">
                                    {actionData.fieldErrors.phone}
                                </span>)
                                : <>&nbsp;</>
                        }
                    </div>

                    <div>
                        <label htmlFor="amount" className="text-light-black">
                            Amount
                        </label>
                        {/* <Label htmlFor='amount' text='Amount' /> */}
                        <input
                            // ref={salaryRef}
                            type="text"
                            name="amount"
                            id="amount"
                            defaultValue={actionData?.fields.amount}
                            className={`block w-full px-3 py-2 border rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${actionData?.fieldErrors.amount ? 'border-red-700' : 'border-gray-400'}`}
                        />
                        {
                            actionData?.fieldErrors.amount
                                ? (<span className="pt-1 text-red-700 text-sm" id="email-error">
                                    {actionData.fieldErrors.amount}
                                </span>)
                                : <>&nbsp;</>
                        }
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