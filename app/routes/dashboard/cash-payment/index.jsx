import { Form, useActionData, useCatch, useLoaderData, useTransition } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import toastStyles from "react-toastify/dist/ReactToastify.css";
import { getTenant, getTenants } from "../../../models/tenant.server";
import { createTenantPayment, getYear, getYears } from "../../../models/year.server";
import { getSession, sessionStorage } from "../../../session.server";
import { badRequest, validateAmount, validateName, validatePhone } from "../../../utils";

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
    console.log({ Month: new Date().toLocaleString('default', { month: 'long' }) });
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

    const tenants = await getTenants();
    const matchedTenant = tenants.find(tenant => tenant.mobile === phone);
    if (!matchedTenant) {
        throw new Response('Tenant does not exist!', {
            status: 400
        });
    }
    const tenantId = matchedTenant.id;
    const res = await createTenantPayment(tenantId, amount);
    console.log({ res });

    const session = await getSession(request);
    session.flash("success", true);

    return redirect('/dashboard/cash-payment', {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}

export default function CashPaymentIndex() {
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
        formRef.current?.reset();
    }, [transition.submission]);

    useEffect(() => {
        if (data.successStatus === true) {
            success();
        }
        return () => {
            toast.dismiss(toastId.current)
        }
    }, [data]);

    //TODO: Focus management
    return (
        <div>
            <p className="text-light-black text-lg font-semibold">Enter tenant details below</p>
            <Form method="post" className="mt-1" ref={formRef}>
                <fieldset className="space-y-1">
                    <div>
                        <label htmlFor="name" className="text-light-black">
                            Name
                        </label>
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
    )
}

export function CatchBoundary() {
    const caught = useCatch();
    return (
        <div>
            <h1 className="font-bold text-xl">Error!</h1>
            <p>Status {caught.status}</p>
            <pre>
                <code className="font-semibold">
                    {caught.data}
                </code>
            </pre>

        </div>
    );
}

export function ErrorBoundary({ error }) {
    return (
        <div>
            <h1>Error!</h1>
            <p>{error.message}</p>
            <p>The stack trace is:</p>
            <pre>{error.stack}</pre>
        </div>
    )
}