import { Form, Link, useActionData, useCatch, useLoaderData, useTransition } from "@remix-run/react";
import { json, redirect } from "@remix-run/server-runtime";
import { useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import toastStyles from "react-toastify/dist/ReactToastify.css";
import Input from "~/components/Input";
import Label from "~/components/Label";
import { createAdvance } from "../../../../models/advance.server";
import { getEmployeeByMobile } from "../../../../models/employee.server";
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

    const matchedEmployee = await getEmployeeByMobile(phone);
    if (!matchedEmployee) {
        throw new Response('Employee does not exist', {
            status: 400
        });
    }

    if (name !== matchedEmployee.name) {
        throw new Response('Name and phone do not match', {
            status: 400
        });
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
        if (!actionData?.fieldErrors) {
            formRef.current?.reset();
        }
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
            <h2 className="text-light-black font-semibold">Enter employee details below</h2>
            <Form method="post" ref={formRef}>
                <fieldset className="space-y-1">
                    <div>
                        <label htmlFor="name" className="text-light-black">
                            Name
                        </label>
                        {/* <Label htmlFor='name' text='Name' /> */}
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
                        {/* <Label htmlFor='phone' text='Phone' /> */}
                        <Input
                            // ref={phoneRef}
                            type="text"
                            name="phone"
                            id="phone"
                            placeholder='0712 345 678'
                            fieldError={actionData?.fieldErrors.phone}
                        />
                    </div>

                    <div>
                        <label htmlFor="amount" className="text-light-black">
                            Amount
                        </label>
                        {/* <Label htmlFor='amount' text='Amount' /> */}
                        <Input
                            // ref={amountRef}
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