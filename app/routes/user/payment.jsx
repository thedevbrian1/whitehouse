import { Form, Link, useActionData, useCatch, useLoaderData, useTransition } from "@remix-run/react"
import { json, redirect } from "@remix-run/server-runtime";
import { useEffect } from "react";
import { useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import toastStyles from "react-toastify/dist/ReactToastify.css";
import Input from "../../components/Input";
import Label from "../../components/Label";
import { getTenantByEmail } from "../../models/tenant.server";
import { createTenantPayment } from "../../models/year.server";
import { getSession, getUser, sessionStorage } from "../../session.server";
import { badRequest, validateAmount, validateMPESACode, validatePhone } from "../../utils";
import { useEventSource } from "~/hooks/useEventSource";

import { createCashTransaction } from "../../models/transaction.server";

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
    const safResponse = session.get('safResponse');
    // console.log({ session: safResponse });
    return json({ safResponse }, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}
export async function action({ request }) {
    const user = await getUser(request);
    const userEmail = user.email;
    const tenant = await getTenantByEmail(userEmail);
    const tenantId = tenant.id;

    const formData = await request.formData();
    // const phone = formData.get('phone');
    const amount = formData.get('amount');
    const MPESACode = formData.get('MPESACode');
    // console.log(MPESACode);

    const fieldErrors = {
        // phone: validatePhone(phone),
        amount: validateAmount(amount),
        MPESACode: validateMPESACode(MPESACode),
    }

    // Return errors if any
    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fieldErrors });
    }

    // console.log({ phone });

    // let modifiedPhone = null;
    // if (phone.length === 10) {
    //     modifiedPhone = phone.replace(0, "254");
    // } else if (phone.length === 13) {
    //     modifiedPhone = phone.substring(1);
    // } else {
    //     modifiedPhone = phone;
    // }

    const date = new Date();
    // const dateString = new Intl.DateTimeFormat('ko-KR').format(date);
    const dateString = date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2);
    // console.log({ dateString });
    const now = date.toLocaleTimeString([], { hour12: false });
    // console.log({ now });
    const timeStamp = String(dateString + now).replace(/\D+/g, '');
    // console.log({ timeStamp });
    // return null;

    // const passwordString = '174379' + 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919' + timeStamp;
    const passwordString = '' + 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919' + timeStamp;
    // console.log({ passwordString });

    // const encodedPassword = Buffer.from(passwordString).toString('base64');
    // console.log({ encodedPassword });

    // return null;

    // console.log({ modifiedPhone });
    // const res = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
    //     method: "post",
    //     headers: {
    //         "Content-Type": "application/json",
    //         // Authorization: `Bearer GrGxErwTkWGfop6QiYjog3btfKcp`,
    //         Authorization: `Bearer gMA52NhICwLuLktQ`
    //     },
    //     body: JSON.stringify({
    //         "BusinessShortCode": 174379,
    //         "Password": Buffer.from(passwordString).toString('base64'),
    //         "Timestamp": timeStamp,
    //         "TransactionType": "CustomerPayBillOnline",
    //         "Amount": 1,
    //         // "PartyA": modifiedPhone,
    //         "PartyA": "0705252897",
    //         "PartyB": 174379,
    //         // "PhoneNumber": modifiedPhone,
    //         "PhoneNumber": "0705252897",
    //         "CallBackURL": "https://whitehouse-7d4f.fly.dev/saf",
    //         "AccountReference": "WhiteHouse",
    //         "TransactionDesc": "Security Payment"
    //     })
    // });


    // console.log({ res: await res.json() });

    //COMMENTED OUT FOR NOW
    // const safResponse = await res.json();
    // console.log({ safResponse });

    // if (safResponse.responseCode === 400) {
    //     throw new Response('Cannot initiate payment', {
    //         status: 400
    //     });
    // }
    const session = await getSession(request);

    // COMMENTED OUT FOR NOW
    // if (safResponse.errorCode?.includes('404')) {
    //     throw new Response(`${safResponse.errorMessage}`, {
    //         status: 404
    //     });
    // } else if (safResponse.errorCode?.includes('500')) {
    //     throw new Response(`${safResponse.errorMessage}`, {
    //         status: 500
    //     });
    // }
    // session.flash("safResponse", safResponse.CustomerMessage);


    // if (safResponse.ResponseCode === 0) {

    //     const url = await fetch('https://tasty-geese-begin-196-216-93-83.loca.lt/saf');
    //     const urlResponse = await url.json();
    //     console.log({ urlResponse });

    // }

    // const res = await createTenantPayment(tenantId, amount);
    // console.log({ res });
    session.flash("success", true);
    
    const res = await createTenantPayment(tenantId, amount);
    const transaction = await createCashTransaction(Number(amount), 'M-PESA', tenantId);
    // console.log({ transaction });
    // console.log({ res });

    logPaymentDetails(userEmail, amount, 'MPESA', MPESACode);

    return redirect('/user', {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}

export default function Payment() {
    const data = useLoaderData();
    const actionData = useActionData();
    const transition = useTransition();

    const phoneRef = useRef(null);
    const amountRef = useRef(null);
    const toastId = useRef(null);
    const formRef = useRef(null);

    function info() {
        toastId.current = toast.info('Check your phone to complete the request', {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    useEffect(() => {
        phoneRef.current?.focus();
    }, [actionData]);

    useEffect(() => {
        if (data.safResponse) {
            info();
        }
        return () => {
            toast.dismiss(toastId.current);
        }
    }, [data]);

    useEffect(() => {
        if (transition.submission) {
            formRef?.current.reset();
        }
    }, [transition.submission]);

    // let eventSourceData = useEventSource('/saf');
    // console.log({ eventSourceData });

    // let eventUrl = '/saf'
    // useEffect(() => {
    //     let eventSourceData = new EventSource(eventUrl);
    //     eventSourceData.addEventListener('message', (event) => {
    //         console.log(event.data);
    //     });
    //     return () => {
    //         eventSourceData.close();
    //     }
    // }, [eventUrl]);


    // useEffect(() => {
    //     const eventSource = new EventSource('https://funny-insects-smoke-196-216-92-235.loca.lt/saf');

    //     eventSource.addEventListener('message', () => {
    //         const data = JSON.parse(e.data);
    //         console.log(data.id, data.msg);
    //     }, false);
    // }, [eventSource]);
    // console.log({ actionData });
    return (
        <div className="max-w-md mx-auto space-y-6 py-8 lg:py-24">
            {/* <p>Payment details will go here</p> */}
            <h2 className="font-semibold text-gray-900 text-lg">How To Pay using M-PESA</h2>
            <div className="space-y-2">
                <p className="px-3 text-gray-500">1. Select Lipa na M-PESA in your M-PESA menu.</p>
                <p className="px-3 text-gray-500">2. Select the <span className="font-weight:700">Pay Bill</span> option.</p>
                <p className="px-3 text-gray-500">3. Input the Whitehouse court Business Number (4032441).</p>
                <p className="px-3 text-gray-500">4. Input the account number starting ith the name david i.e david#plot No/House No (E.g. david#1/1)</p>
                <p className="px-3 text-gray-500">5. Input the amount you'd like to pay.</p>
                <p className="px-3 text-gray-500">6. Enter your M-PESA pin to complete the transaction.</p>
                <p className="text-amber-500 border-2 border-l-amber-500 rounded py-3 px-3 bg-amber-50 italic">
                    Excess payments will be used to clear arrears.The earliest arrears will be cleared first.
                </p><br></br>
                {/* { actionData.fieldError.MPESACode } */}
            </div>
            <Form method="post" ref={formRef}>
                <fieldset>
                    <Label htmlFor='MPESACode' className="font-weight-bold" text='Enter the MPESA Transaction Code' />
                    <Input
                        ref={phoneRef}
                        type="text"
                        name="MPESACode"
                        id="MPESACode"
                        placeholder="E.g. QUA12LI23S"
                        fieldError={actionData?.fieldErrors.MPESACode }
                    />
                    {/* <div> */}
                        {/* <label htmlFor="phone" className="uppercase text-gray-500 pb-2">Enter MPESA phone number</label> */}
                        {/* <Label htmlFor='phone' text='Enter MPESA phone number' />
                        <Input
                            ref={phoneRef}
                            type="text"
                            name="phone"
                            id="phone"
                            placeholder="0712345678"
                            fieldError={actionData?.fieldErrors.phone}
                        />
                    </div>
                    <div> */}
                        {/* <label htmlFor="amount" className="uppercase text-gray-600 pb-2">Enter amount</label> */}
                        <div className="pt-3"><Label htmlFor='amount' className="pt-3" text='Confirm the Amount Paid' />
                        <Input
                            ref={amountRef}
                            type="number"
                            name="amount"
                            id="amount"
                            placeholder="E.g. 200"
                            fieldError={actionData?.fieldErrors.amount}
                        /></div>
                    {/* </div>
                    <button type="submit" className="bg-blue-600 mt-3 px-6 py-2 text-white text-center w-full rounded focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {transition.submission ? 'Processing...' : 'Pay'}
                    </button> */}

                    <button type="submit" className="bg-blue-600 mt-3 px-6 py-2 text-white text-center w-full rounded focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {transition.submission ? 'Processing...' : 'Complete'}
                    </button>
                </fieldset>
            </Form>

            {/* <div className="space-y-4">
                <p className="text-blue-600 border-2 border-l-blue-500 rounded py-2 px-3 bg-blue-100">A prompt will appear on your phone. Enter MPESA pin to complete the request.</p>
                <p className="text-amber-500 border-2 border-l-amber-500 rounded py-1 px-3 bg-amber-50 italic">
                    Excess payments will be used to clear arrears.The earliest arrears will be cleared first.
                </p>
            </div> */}
            <ToastContainer />
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
    );
}

function logPaymentDetails(email, amount, transactionType, MPESACode) {
    const fs = require('fs');
    let content = null;

    let date = new Date().toDateString() + ' ' + new Date().toLocaleTimeString();
    content = `User ${email} made ${transactionType} payment of Ksh ${amount} transaction ID ${MPESACode} on ${date}.  \n`;
    fs.appendFile('./transactionLogs.txt', content, err => {
        if (err) {
            console.error(err);
        }
    });
}