import { Form, Link, useActionData, useCatch, useLoaderData, useTransition } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import toastStyles from "react-toastify/dist/ReactToastify.css";
import { getTenantByMobile } from "../../../models/tenant.server";
import { createTenantPayment } from "../../../models/year.server";
import { getSession, sessionStorage } from "../../../session.server";
import { badRequest, validateAmount, validateName, validatePhone } from "../../../utils";
import { createCashTransaction } from "../../../models/transaction.server";
import Input from "~/components/Input";

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
    const formData = await request.formData();
    const name = formData.get('name');
    const phone = formData.get('phone');
    const year = formData.get('year');
    const month = formData.get('month');
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

    const matchedTenant = await getTenantByMobile(phone);
    if (!matchedTenant) {
        throw new Response('Tenant does not exist!', {
            status: 400
        });
    }

    if (name !== matchedTenant.name) {
        throw new Response('Name and phone do not match!', {
            status: 400
        });
    }

    const tenantId = matchedTenant.id;
    let status = null;
    //get amount
    //check if month is paid
    //if not paid, subtract 200 from amount
    //update month to paid
    //update arrears. Subtract remaining amount from arrears
    //if arrears > 0 divide amount by 200 to get the no of months
    //update the monthly status of the no of calculated unpaid months




    //
    // check if there are arrears
    // if (amount >= 200) {
    //     status = 'paid'
    // } else if (amount > 0 && amount < 200) {
    //     status = 'partial'
    // } else if (amount === 0) {
    //     status = 'not paid'
    // }

    // TODO: Record arrears correctly in the db
    // TODO: Add year and month dropdown so that users can select the month to pay for themselves.

    const res = await createTenantPayment(tenantId, status);
    const transaction = await createCashTransaction(Number(amount), 'Cash', tenantId);
    // console.log({ transaction });
    // console.log({ res });

    const session = await getSession(request);
    session.flash("success", true);

    logPaymentDetails(matchedTenant.email, amount, 'Cash');
    console.log(matchedTenant.email);

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
        <div className="px-3 py-2 space-y-2">
            <h2 className="text-light-black text-lg font-semibold">Enter tenant details below</h2>
            <Form method="post" className="mt-1" ref={formRef}>
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
                            placeholder='0712 345 678'
                            fieldError={actionData?.fieldErrors.phone}
                        />

                    </div>

                    <div className="flex justify-between">
                        <div>
                            <label htmlFor="year">Select year</label>
                            <select
                                name="year"
                                id="year"
                                className="px-3 h-7 ml-3 bg-[#f8f8ff] border border-[#c0c0c0] rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="month">Select month</label>
                            <select
                                name="month"
                                id="month"
                                className="h-7 px-3 ml-3 bg-[#f8f8ff] border border-[#c0c0c0] rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="January">January</option>
                                <option value="February">February</option>
                            </select>
                        </div>
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
            <Link to="." className="text-blue-500 underline">
                Try again
            </Link>
        </div>
    );
}

export function ErrorBoundary({ error }) {
    console.error(error);
    return (
        <div>
            <h1>Error!</h1>
            <p>{error.message}</p>
        </div>
    );
}

function logPaymentDetails(email, amount, transactionType) {
    const fs = require('fs');
    let content = null;

    let date = new Date().toDateString() + ' ' + new Date().toLocaleTimeString();
    content = `User ${email} made ${transactionType} payment of Ksh ${amount} on ${date}.  \n`;
    fs.appendFile('./transactionLogs.txt', content, err => {
        if (err) {
            console.error(err);
        }
    });
}