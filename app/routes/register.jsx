import { Form, Link, useActionData, useCatch, useFetcher, useTransition } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { useRef, useEffect, useState } from "react";
import { createHouse } from "../models/house.server";
import { createTenant } from "../models/tenant.server";
import { badRequest, trimPhone, validateDate, validateEmail, validateHouseNumber, validateName, validateNationalId, validatePassword, validatePhone, validatePlotNumber, validateVehicleRegistration } from "../utils";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { createUser, isEmailUsed } from "../models/user.server";
// import { useState } from "react";
import Input from "../components/Input";
import Label from "~/components/Label";
import { getSession } from "~/session.server";

// TODO: Add toasts for user feedback
// TODO: Make sure passwords don't match

export function meta() {
    return {
        title: 'Register | White House Court',
        description: 'Register as a White House Court tenant'
    };
}

export async function loader({ request }) {
    const session = await getSession(request);

    return null;
}

export async function action({ request }) {
    const formData = await request.formData();
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const nationalId = formData.get('nationalId');
    const plotNo = formData.get('plotNo');
    const houseNo = formData.get('houseNo');
    const date = formData.get('date');
    const vehicleRegistration = formData.get('vehicleRegistration');
    // const termsAndConditions = formData.get('termsAndConditions');

    const trimmedPhone = trimPhone(phone);
    console.log({ phone });
    console.log({ trimmedPhone });

    if (trimmedPhone.includes('+')) {
        console.log('Has plus');
    }

    const fields = {
        name,
        phone,
        email,
        nationalId,
        plotNo,
        houseNo,
        date,
        vehicleRegistration
    };

    const fieldErrors = {
        name: validateName(name),
        phone: validatePhone(trimmedPhone),
        email: validateEmail(email),
        password: validatePassword(password),
        confirmPassword: validatePassword(confirmPassword),
        nationalId: validateNationalId(nationalId),
        plotNo: validatePlotNumber(Number(plotNo)),
        houseNo: validateHouseNumber(houseNo),
        moveInDate: validateDate(date),
        vehicleRegistration: validateVehicleRegistration(vehicleRegistration)
    };

    // // Return errors if any
    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fields, fieldErrors });
    }

    if (password !== confirmPassword) {
        // console.log({ match: password === confirmPassword });
        return badRequest({
            fields, fieldErrors: {
                confirmPassword: 'Password does not match',
            }
        });
    }

    // const moveInDate = new Date(date).toISOString();
    const usedEmail = await isEmailUsed(email);
    if (usedEmail) {
        throw new Response('Email has been used. Try another email', {
            status: 400
        });
    }

    let modifiedPhone = null;

    if (trimmedPhone.length === 12) {
        modifiedPhone = '0' + trimmedPhone.slice(3);
        console.log({ modifiedPhone });
    } else if (trimmedPhone.length === 10) {
        modifiedPhone = trimmedPhone;
    }
    // return null;

    const tenant = await createTenant(name, modifiedPhone, email, Number(nationalId), date, vehicleRegistration);

    const tenantId = tenant.id;

    // console.log({ user });
    const res = await createHouse(Number(plotNo), houseNo, tenantId);

    const user = await createUser(email, password);
    // console.log({ res });

    logRegistrationDetails(name, email, modifiedPhone, plotNo, houseNo);

    return redirect('/success');
}

export default function Register() {
    const actionData = useActionData();
    const transition = useTransition();
    const fetcher = useFetcher();


    const nameRef = useRef(null);
    const phoneRef = useRef(null);
    const emailRef = useRef(null);
    const nationalIdRef = useRef(null);
    const plotNoRef = useRef(null);
    const houseNoRef = useRef(null);
    const dateRef = useRef(null);
    const vehicleRegRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    function handleBlur(event) {
        fetcher.submit(event.target.value, {
            method: "post",
            action: "/resources/user-details"
        })
    }

    useEffect(() => {
        nameRef.current?.focus();

        if (actionData?.fieldErrors.name) {
            nameRef.current?.focus();
        } else if (actionData?.fieldErrors.phone) {
            phoneRef.current?.focus();
        } else if (actionData?.fieldErrors.nationalId) {
            nationalIdRef.current?.focus();
        } else if (actionData?.fieldErrors.plotNo) {
            plotNoRef.current?.focus();
        } else if (actionData?.fieldErrors.houseNo) {
            houseNoRef.current?.focus();
        } else if (actionData?.fieldErrors.moveInDate) {
            dateRef.current?.focus();
        } else if (actionData?.fieldErrors.vehicleRegistration) {
            vehicleRegRef.current?.focus();
        } else if (actionData?.fieldErrors.email) {
            emailRef.current?.focus();
        } else if (actionData?.fieldErrors.password) {
            passwordRef.current?.focus();
        } else if (actionData?.fieldErrors.confirmPassword) {
            confirmPasswordRef.current?.focus();
        }
    }, [actionData]);

    return (
        <main className="w-4/5 lg:max-w-4xl mx-auto py-10 space-y-2">
            <div className="flex flex-col items-center space-y-2">
                <div className="w-14 h-14">
                    <img src="/W.svg" alt="W" className="w-full h-full" />
                </div>
                <h1 className="font-bold text-3xl lg:text-4xl text-center">White House Court</h1>

            </div>
            {/* <h1 className="font-bold text-2xl lg:text-4xl lg:text-center">White House Court</h1> */}
            <h2 className="font-semibold text-xl lg:text-2xl lg:text-center">Tenant registration form</h2>
            <p className="text-light-black lg:text-center">Fill in the details below to register as a tenant of White House court</p>
            <p className="text-light-black lg:text-center"><em>(Fields marked with * are compulsory)</em></p>
            <Form method="post" replace>
                <fieldset className="">
                    <h3 className="font-semibold text-lg">Personal information</h3>
                    <div className="grid lg:grid-cols-2 gap-1 lg:gap-4 mt-2">
                        <div>
                            {/* <label htmlFor="name" className="text-black">
                                Full name *
                            </label> */}
                            <Label htmlFor='name' text='Full name *' />
                            <Input
                                ref={nameRef}
                                type="text"
                                name="name"
                                id="name"
                                placeholder=""
                                fieldError={actionData?.fieldErrors.name}
                                onBlur={handleBlur}
                            />
                        </div>
                        <div>
                            {/* <label htmlFor="phone" className="text-black">
                                Phone *
                            </label> */}
                            <Label htmlFor='phone' text='Phone *' />
                            <Input
                                ref={phoneRef}
                                type="text"
                                name="phone"
                                id="phone"
                                placeholder=""
                                fieldError={actionData?.fieldErrors.phone}
                            />
                        </div>
                        <div>
                            {/* <label htmlFor="nationalId" className="text-black">
                                National Id *
                            </label> */}
                            <Label htmlFor='nationalId' text='National id *' />
                            <Input
                                ref={nationalIdRef}
                                type="number"
                                name="nationalId"
                                id="nationalId"
                                placeholder=""
                                fieldError={actionData?.fieldErrors.nationalId}
                            />
                        </div>
                        <div>
                            {/* <label htmlFor="plotNo" className="text-black">
                                Plot number *
                            </label> */}
                            <Label htmlFor='plotNo' text='Plot number *' />
                            <Input
                                ref={plotNoRef}
                                type="number"
                                name="plotNo"
                                id="plotNo"
                                placeholder=""
                                // fieldError={actionData?.fieldErrors.plotNo}
                                className={`block w-full px-3 py-2 border rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${actionData?.fieldErrors.plotNo ? 'border-red-700' : 'border-gray-400'}`}
                            />
                            {
                                actionData?.fieldErrors.plotNo
                                    ? (<span className="pt-1 text-red-700 text-sm" id="email-error">
                                        {actionData.fieldErrors.plotNo}
                                    </span>)
                                    : <>&nbsp;</>
                            }
                        </div>
                        <div>
                            {/* <label htmlFor="houseNo" className="text-black">
                                House number *
                            </label> */}
                            <Label htmlFor='houseNo' text='House number *' />
                            <Input
                                ref={houseNoRef}
                                type="text"
                                name="houseNo"
                                id="houseNo"
                                placeholder=""
                                fieldError={actionData?.fieldErrors.houseNo}
                            />
                        </div>
                        <div>
                            {/* <label htmlFor="date" className="text-black">
                                Move in date
                            </label> */}
                            <Label htmlFor='date' text='Move in date' />
                            <Input
                                ref={dateRef}
                                type="date"
                                name="date"
                                id="date"
                                placeholder=""
                                fieldError={actionData?.fieldErrors.moveInDate}
                            />
                        </div>
                        <div>
                            {/* <label htmlFor="vehicleRegistration" className="text-black">
                                Vehicle registration
                            </label> */}
                            <Label htmlFor='vehicleRegistration' text='Vehicle registration' />
                            <Input
                                ref={vehicleRegRef}
                                type="text"
                                name="vehicleRegistration"
                                id="vehicleRegistration"
                                placeholder=""
                                fieldError={actionData?.fieldErrors.vehicleRegistration}
                            />
                        </div>
                    </div>
                    <h3 className="font-semibold text-lg">Account information</h3>
                    <em>This info will be used to log in to the White House app</em>
                    <div className="grid lg:grid-cols-2 gap-1 lg:gap-4 mt-2">
                        <div>
                            {/* <label htmlFor="email" className="text-black">
                                Email *
                            </label> */}
                            <Label htmlFor='email' text='Email *' />
                            <Input
                                ref={emailRef}
                                type="email"
                                name="email"
                                id="email"
                                placeholder=""
                                fieldError={actionData?.fieldErrors.email}
                            />
                        </div>
                        <div>
                            {/* <label htmlFor="password" className="text-black">
                                Password *
                            </label> */}
                            <Label htmlFor='password' text='password *' />
                            <Input
                                ref={passwordRef}
                                type="password"
                                name="password"
                                id="password"
                                placeholder=""
                                fieldError={actionData?.fieldErrors.password}
                            />
                        </div>
                        <div>
                            {/* <label htmlFor="confirmPassword" className="text-black">
                                Confirm password *
                            </label> */}
                            <Label htmlFor='confirmPassword' text='Confirm password *' />
                            <Input
                                ref={confirmPasswordRef}
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                placeholder=""
                                fieldError={actionData?.fieldErrors.confirmPassword}
                            />

                        </div>
                    </div>
                    <div className="space-x-2">
                        <input
                            required
                            type="checkbox"
                            name="termsAndConditions"
                            id="termsAndConditions"
                        />
                        <label className="text-gray-600">I have read and agree to the &nbsp;<Link to="/terms-and-conditions" target="blank" className="text-blue-600 underline hover:text-blue-500">Terms and conditions</Link></label>
                    </div>
                    <button type="submit" className="mt-2 lg:col-span-2 bg-blue-600 px-6 py-2 text-white text-center w-full lg:w-1/2 justify-self-center rounded focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {transition.submission ? 'Registering...' : 'Register'}
                    </button>
                </fieldset>
            </Form>
        </main>
    )
}

export function CatchBoundary() {
    const caught = useCatch();

    return (
        <div className="w-full h-screen grid place-items-center">
            <div>
                <div className="w-72 h-72 lg:w-80 lg:h-80">
                    <img src="/bad-request.svg" alt="" className="w-full h-full" />
                </div>
                <div className="flex flex-col items-center gap-1">
                    <h1 className="font-bold text-6xl">Error</h1>
                    <p>Status: {caught.status}</p>
                    <pre className="text-lg">
                        <code className="font-bold">
                            {caught.data}
                        </code>
                    </pre>
                    <Link to="/register" className="text-blue-500 underline hover:text-blue-700">
                        <ArrowLeftIcon className="w-5 h-5 inline" /> Back to form
                    </Link>
                </div>
            </div>
        </div>
    );
}

export function ErrorBoundary({ error }) {
    return (
        <div>
            <h1>Error</h1>
            <p>{error.message}</p>
            <p>The stack trace is:</p>
            <pre>{error.stack}</pre>
        </div>
    )
}

function logRegistrationDetails(name, email, phone, plot, house) {
    const fs = require('fs');
    let content = null;

    let date = new Date().toDateString() + ' ' + new Date().toLocaleTimeString();
    // content = `User ${email} made ${transactionType} payment of Ksh ${amount} transaction ID ${MPESACode} on ${date}.  \n`;
    content = `New tanant ${name} of email ${email} and phone number ${phone} registered to ${plot}/${house} on  ${date}.  \n`;
    fs.appendFile('./infologs.txt', content, err => {
        if (err) {
            console.error(err);
        }
    });
}