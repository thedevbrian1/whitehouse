import { Form, useActionData, useLoaderData, useLocation, useTransition } from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";
import { useEffect, useRef } from "react";
import { getTenant } from "../../../models/tenant.server";
import { createTenantPayment } from "../../../models/year.server";
import { getSession, sessionStorage } from "../../../session.server";
import { badRequest, validateName, validatePhone, validateAmount } from "../../../utils";

export async function loader({ params }) {
    const tenantId = params.id;
    const tenant = await getTenant(tenantId);
    console.log({ tenant });
    return tenant;
}

export async function action({ request, params }) {
    const tenantId = params.id;
    const formData = await request.formData();
    const name = formData.get('name');
    const phone = formData.get('phone');
    const amount = formData.get('amount');
    const fieldErrors = {
        name: validateName(name),
        phone: validatePhone(phone),
        amount: validateAmount(amount),
    };

    const fields = {
        name,
        phone
    }

    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fields, fieldErrors });
    }
    // Check if tenant exists
    // Record amount in the database

    const res = await createTenantPayment(tenantId, amount);

    // console.log({ res });

    const session = await getSession(request);
    session.flash("success", true);

    return redirect('/dashboard/cash-payment', {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}

export default function CashPaymentSlug() {
    const data = useLoaderData();
    const actionData = useActionData();
    const transition = useTransition();
    const location = useLocation();
    const amountRef = useRef(null);

    useEffect(() => {
        amountRef.current?.focus();
    }, [location]);
    return (
        <div>
            <p className="text-light-black text-lg font-semibold">Enter tenant details below</p>
            <Form method="post" className="mt-1" key={data.id}>
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
                            defaultValue={actionData ? actionData?.fields.name : data.name}
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
                            defaultValue={actionData ? actionData?.fields.phone : data.mobile}
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
                            ref={amountRef}
                            type="text"
                            name="amount"
                            id="amount"
                            // defaultValue={actionData?.fields.amount}
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
        </div>
    )
}