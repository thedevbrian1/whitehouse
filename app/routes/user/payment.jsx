import { Form, Link, useActionData, useCatch, useTransition } from "@remix-run/react"
import { redirect } from "@remix-run/server-runtime";
import { useEffect } from "react";
import { useRef } from "react";
import Input from "../../components/Input";
import { getTenantByEmail } from "../../models/tenant.server";
import { createTenantPayment } from "../../models/year.server";
import { getSession, getUser, sessionStorage } from "../../session.server";
import { badRequest, validateAmount, validatePhone } from "../../utils";

export async function loader() {
    // const now = new Date().toTimeString();
    // console.log(now);
    return null;
}
export async function action({ request }) {
    const user = await getUser(request);
    const userEmail = user.email;
    const tenant = await getTenantByEmail(userEmail);
    const tenantId = tenant.id;
    const formData = await request.formData();
    const phone = formData.get('phone');
    const fieldErrors = {
        phone: validatePhone(phone)
    }

    // Return errors if any
    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fieldErrors });
    }

    console.log({ phone });
    let modifiedPhone = null;
    if (phone.length === 10) {
        modifiedPhone = phone.replace(0, "254");
    } else if (phone.length === 13) {
        modifiedPhone = phone.substring(1);
    } else {
        modifiedPhone = phone;
    }

    const date = new Date();
    const dateString = new Intl.DateTimeFormat('ko-KR').format(date);
    console.log({ dateString });
    const now = date.toLocaleTimeString([], { hour12: false });
    console.log({ now });
    const timeStamp = String(dateString + now).replace(/\D+/g, '');
    console.log({ timeStamp });
    // return null;

    const passwordString = timeStamp + '174379' + 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
    console.log({ passwordString });

    // const encodedPassword = Buffer.from(passwordString).toString('base64');
    // console.log({ encodedPassword });

    // return null;

    console.log({ modifiedPhone });
    const res = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer v9WbVjuSRBGp8muHZltzAQjqX71B`
        },
        body: JSON.stringify({
            "BusinessShortCode": 174379,
            "Password": Buffer.from(passwordString).toString('base64'),
            "Timestamp": timeStamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": 1,
            "PartyA": 254710162152,
            "PartyB": 174379,
            "PhoneNumber": 254710162152,
            "CallBackURL": "https://mydomain.com/path",
            "AccountReference": "WhiteHouse",
            "TransactionDesc": "Payment of X"
        })
    });
    console.log({ res: await res.json() });
    const safResponse = await res.json();

    if (safResponse.responseCode === 400) {
        throw new Response('Cannot initiate payment', {
            status: 400
        });
    }
    // const res = await createTenantPayment(tenantId, amount);
    // console.log({ res });
    const session = await getSession(request);
    session.flash("success", true);

    return redirect('/user', {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}

export default function Payment() {
    const actionData = useActionData();
    const transition = useTransition();

    const phoneRef = useRef();

    useEffect(() => {
        phoneRef.current?.focus();
    }, [actionData]);

    return (
        <div className="max-w-md mx-auto space-y-10 mt-32">
            <Form method="post" className="">
                <div>
                    <label htmlFor="amount">Enter phone number</label>
                    <Input
                        ref={phoneRef}
                        type="text"
                        name="phone"
                        id="phone"
                        placeholder="0710162152"
                        fieldError={actionData?.fieldErrors.phone}
                    />
                    <button type="submit" className="bg-blue-600 mt-3 px-6 py-2 text-white text-center w-full rounded focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {transition.submission ? 'Processing...' : 'Pay'}
                    </button>
                </div>
            </Form>

            <div className="space-y-4">
                <p className="text-blue-600 border-2 border-l-blue-500 rounded py-6 px-3 bg-blue-100">A prompt will appear on your phone. Enter MPESA pin to complete the request.</p>
                <p className="text-amber-500 border-2 border-l-amber-500 rounded py-6 px-3 bg-amber-50 italic">
                    Excess payments will be used to clear arrears.The earliest arrears will be cleared first.
                </p>
            </div>
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
            <Link to="." className="text-blue-500 underline">
                Try again
            </Link>
        </div>
    )
}