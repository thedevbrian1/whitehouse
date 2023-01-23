import { Form, useActionData, useLoaderData, useLocation, useTransition } from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";
import { useEffect, useRef } from "react";
import { getTenantById } from "../../../models/tenant.server";
import { createTenantPayment } from "../../../models/year.server";
import { getSession, sessionStorage } from "../../../session.server";
import { badRequest, validateAmount } from "../../../utils";
import { createCashTransaction } from "../../../models/transaction.server";
import Input from "~/components/Input";

export async function loader({ params }) {
    const tenantId = params.id;
    const tenant = await getTenantById(tenantId);
    // console.log({ tenant });
    return tenant;
}

export async function action({ request, params }) {
    const tenantId = params.id;
    const formData = await request.formData();
    const amount = formData.get('amount');

    const fieldErrors = {
        amount: validateAmount(amount),
    };


    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fieldErrors });
    }
    // Check if tenant exists
    // Record amount in the database
    let status = 'paid';
    const res = await createTenantPayment(tenantId, status);
    const transaction = await createCashTransaction(Number(amount), 'Cash', tenantId);
    const matchedTenant = await getTenantById(tenantId);


    const session = await getSession(request);
    session.flash("success", true);

    logPaymentDetails(matchedTenant.email, amount, 'Cash');

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
        <div className="px-3 py-2 space-y-2">
            <h2 className="font-semibold text-lg text-light-black">Employee details</h2>
            <div className="text-gray-800">
                <p>Name: &nbsp; <span className="text-light-black">{data.name}</span></p>
                <p>Phone: &nbsp; <span className="text-light-black">{data.mobile}</span></p>
                <p>Plot {data.house.plotNumber} / House {data.house.houseNumber}</p>
            </div>
            <Form method="post" className="mt-1" key={data.id}>
                {/* TODO: Use readonly input fields or just a div with info */}
                <fieldset className="space-y-1">
                    <h3 className="text-light-black font-semibold">Enter amount below</h3>
                    <div>
                        <label htmlFor="amount" className="text-light-black">
                            Amount
                        </label>
                        <Input
                            ref={amountRef}
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
        </div>
    )
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