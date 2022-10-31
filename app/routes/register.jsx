import { Form, Link, useActionData, useCatch, useTransition } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { useRef, useEffect } from "react";
import { createHouse } from "../models/house.server";
import { createTenant } from "../models/tenant.server";
import { badRequest, validateDate, validateEmail, validateHouseNumber, validateName, validateNationalId, validatePassword, validatePhone, validatePlotNumber, validateVehicleRegistration } from "../utils";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { createUser } from "../models/user.server";
// import { useState } from "react";
import Input from "../components/Input";

// TODO: Add toasts for user feedback
// TODO: Make sure passwords don't match

export function meta() {
    return {
        title: 'Register | White House Court',
        description: 'Register as a White House Court tenant'
    };
}

export async function loader() {

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

    // const safariomRegex = /^(?:254|\+254|0)?([71](?:(?:0[0-8])|(?:[12][0-9])|(?:9[0-9])|(?:4[0-3])|(?:4[68]))[0-9]{6})$/;

    // const airtelRegex = /^(?:254|\+254|0)?(7(?:(?:3[0-9])|(?:5[0-6])|(?:8[0-2])|(?:8[6-9]))[0-9]{6})$/;

    // const telkomRegex = /^(?:254|\+254|0)?(77[0-9][0-9]{6})$/;

    // const res = phone.match(telkomRegex);

    // console.log({ res });

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
        phone: validatePhone(phone),
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
        console.log({ match: password === confirmPassword });
        return badRequest({
            fields, fieldErrors: {
                confirmPassword: 'Password does not match',
            }
        });
    }

    const moveInDate = new Date(date).toISOString();

    const tenant = await createTenant(name, phone, email, Number(nationalId), moveInDate, vehicleRegistration);

    const tenantId = tenant.id;

    // console.log({ user });
    const res = await createHouse(Number(plotNo), houseNo, tenantId);

    const user = await createUser(email, password);
    // console.log({ res });

    return redirect('/success');
}

export default function Register() {
    const actionData = useActionData();
    const transition = useTransition();

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
            <h1 className="font-bold text-2xl lg:text-4xl lg:text-center">White House Court</h1>
            <h2 className="font-semibold text-xl lg:text-2xl lg:text-center">Tenant registration form</h2>
            <p className="text-light-black lg:text-center">Fill in the details below to register as a tenant of White House court</p>
            <p className="text-light-black lg:text-center"><em>(Fields marked with * are compulsory)</em></p>
            <Form method="post" replace>
                <fieldset className="">
                    <h3 className="font-semibold text-lg">Personal information</h3>
                    <div className="grid lg:grid-cols-2 gap-1 lg:gap-4 mt-2">
                        <div>
                            <label htmlFor="name" className="text-black">
                                Full name *
                            </label>
                            <Input
                                ref={nameRef}
                                type="text"
                                name="name"
                                id="name"
                                placeholder=""
                                fieldError={actionData?.fieldErrors.name}
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="text-black">
                                Phone *
                            </label>
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
                            <label htmlFor="nationalId" className="text-black">
                                National Id *
                            </label>
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
                            <label htmlFor="plotNo" className="text-black">
                                Plot number *
                            </label>
                            <Input
                                ref={plotNoRef}
                                type="number"
                                name="plotNo"
                                id="plotNo"
                                placeholder=""
                                fieldError={actionData?.fieldErrors.plotNo}
                            />
                        </div>
                        <div>
                            <label htmlFor="houseNo" className="text-black">
                                House number *
                            </label>
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
                            <label htmlFor="date" className="text-black">
                                Move in date
                            </label>
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
                            <label htmlFor="vehicleRegistration" className="text-black">
                                Vehicle registration
                            </label>
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
                            <label htmlFor="email" className="text-black">
                                Email *
                            </label>
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
                            <label htmlFor="password" className="text-black">
                                Password *
                            </label>
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
                            <label htmlFor="confirmPassword" className="text-black">
                                Confirm password *
                            </label>
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
                    <button type="submit" className="lg:mt-1 lg:col-span-2 bg-blue-600 px-6 py-2 text-white text-center w-full lg:w-1/2 justify-self-center rounded focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500">
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