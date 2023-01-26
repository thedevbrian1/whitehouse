import { Form, Link, useActionData, useCatch, useTransition } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { useEffect, useRef } from "react";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import Heading from "../../../components/Heading";
import { badRequest, trimPhone, validateDate, validateEmail, validateHouseNumber, validateName, validateNationalId, validatePhone, validatePlotNumber, validateVehicleRegistration } from "../../../utils";
import { getSession, sessionStorage } from "../../../session.server";
import { createTenant, getTenants } from "../../../models/tenant.server";
import { createUser, isEmailUsed } from "../../../models/user.server";
import { createHouse } from "../../../models/house.server";
import Input from "../../../components/Input";
import Label from "~/components/Label";


export async function loader() {
    const tenants = await getTenants();
    return null;
}
export async function action({ request }) {
    const formData = await request.formData();
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const nationalId = formData.get('nationalId');
    const plotNo = formData.get('plotNo');
    const houseNo = formData.get('houseNo');
    const date = formData.get('date');
    const vehicleRegistration = formData.get('vehicleRegistration');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    const trimmedPhone = trimPhone(phone);

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
        nationalId: validateNationalId(nationalId),
        plotNo: validatePlotNumber(Number(plotNo)),
        houseNo: validateHouseNumber(houseNo),
        moveInDate: validateDate(date),
        vehicleRegistration: validateVehicleRegistration(vehicleRegistration)
    };


    // Return errors if any
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

    const moveInDate = new Date(date);

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

    const tenant = await createTenant(name, modifiedPhone, email, Number(nationalId), moveInDate, vehicleRegistration);

    const tenantId = tenant.id;

    const res = await createHouse(Number(plotNo), houseNo, tenantId);
    // console.log({ res });

    const user = await createUser(email, password);

    const session = await getSession(request);
    session.flash('success', true);

    return redirect('/dashboard/tenants', {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
    // TODO: Redirect to 
}

export default function NewTenantEntry() {
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
        } else if (actionData?.fieldErrors.email) {
            emailRef.current?.focus();
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
        }
    }, [actionData]);
    return (
        <div className="space-y-4 max-w-5xl mx-auto pb-8">
            <Link to=".." className="text-black hover:underline hover:text-blue-500">
                <ArrowLeftIcon className="w-5 h-5 inline" /> Back to tenants
            </Link>
            <Heading title='Add tenant' />
            <p className="text-light-black"><em>(Fields marked with * are compulsory)</em></p>

            <h2 className=" text-light-black text-lg font-semibold">Enter tenant details below</h2>
            <Form method="post">
                <fieldset >
                    <div className="grid lg:grid-cols-2 gap-1 lg:gap-x-5">
                        <div>
                            <Label htmlFor='name' text='Full name *' />
                            <Input
                                ref={nameRef}
                                type='text'
                                name='name'
                                id='name'
                                placeholder='John Doe'
                                fieldError={actionData?.fieldErrors.name}
                            />
                        </div>
                        <div>
                            <Label htmlFor='phone' text='Phone *' />
                            <Input
                                ref={phoneRef}
                                type='text'
                                name='phone'
                                id='phone'
                                placeholder='0712 345 678'
                                fieldError={actionData?.fieldErrors.phone}
                            />

                        </div>
                        <div>
                            <Label htmlFor='nationalId' text='National id *' />
                            <Input
                                ref={nationalIdRef}
                                type='number'
                                name='nationalId'
                                id='nationalId'
                                fieldError={actionData?.fieldErrors.nationalId}
                            // maxLength={8}

                            />

                        </div>
                        <div>
                            <Label htmlFor='plotNo' text='Plot number *' />
                            <Input
                                ref={plotNoRef}
                                type="number"
                                name="plotNo"
                                id="plotNo"
                                // min={1}
                                // max={67}
                                fieldError={actionData?.fieldErrors.plotNo}

                            />
                        </div>
                        <div>

                            <Label htmlFor='houseNo' text='House number *' />
                            <Input
                                ref={houseNoRef}
                                type="text"
                                name="houseNo"
                                id="houseNo"
                                fieldError={actionData?.fieldErrors.houseNo}
                            />

                        </div>
                        <div>
                            <Label htmlFor='date' text='Move in date' />
                            <Input
                                ref={dateRef}
                                type="date"
                                name="date"
                                id="date"
                                fieldError={actionData?.fieldErrors.moveInDate}
                            />
                        </div>
                        <div>
                            <Label htmlFor='vehicleRegistration' text='Vehicle registration' />
                            <Input
                                ref={vehicleRegRef}
                                type="text"
                                name="vehicleRegistration"
                                id="vehicleRegistration"
                                fieldError={actionData?.fieldErrors.vehicleRegistration}
                            />
                        </div>

                    </div>
                    <h3 className="font-semibold text-lg text-light-black">Account information</h3>
                    <em className="text-light-black">This info will be used to log in to the White House app</em>
                    <div className="grid lg:grid-cols-2 gap-1 lg:gap-4 mt-2">
                        <div>
                            <Label htmlFor='email' text='Email *' />
                            <Input
                                ref={emailRef}
                                type="email"
                                name="email"
                                id="email"
                                placeholder="johndoe@gmail.com"
                                fieldError={actionData?.fieldErrors.email}
                            />
                        </div>
                        <div>
                            <Label htmlFor='password' text='Password *' />
                            <Input
                                ref={passwordRef}
                                type="password"
                                name="password"
                                id="password"
                                fieldError={actionData?.fieldErrors.password}
                            />
                        </div>
                        <div>
                            <Label htmlFor='confirmPassword' text='Confirm password *' />
                            <Input
                                ref={confirmPasswordRef}
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                fieldError={actionData?.fieldErrors.confirmPassword}
                            />

                        </div>
                    </div>
                    <button type="submit" className="lg:col-span-2 bg-blue-600 px-6 py-2 text-white text-center w-full lg:w-1/2 justify-self-center rounded focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {transition.submission ? 'Adding...' : 'Add'}
                    </button>
                </fieldset>
            </Form>
        </div>
    );
}

export function CatchBoundary() {
    const caught = useCatch();
    return (
        <div className="w-full h-screen grid justify-center">
            <div className="mt-20">
                <div className="w-20 h-20 lg:w-40 lg:h-40">
                    <img src="/space.svg" alt="A handcraft illustration of space" className="w-full h-full" />

                </div>
                <h1 className="font-bold text-2xl md:text-3xl">Error!</h1>
                <pre>
                    <code>
                        Status {caught.status}
                    </code>
                </pre>
                <p className="font-semibold mb-4">{caught.data}</p>
                <Link to="." className="text-blue-500 hover:text-blue-400 underline">Try again</Link>
            </div>
        </div>
    );
}

// TODO: Insert error to logfile
export function ErrorBoundary({ error }) {
    console.error(error);
    return (
        <div className="w-full h-screen grid justify-center">
            <div className="mt-20">
                <div className="w-20 h-20 lg:w-40 lg:h-40">
                    <img src="/space.svg" alt="A handcraft illustration of space" className="w-full h-full" />

                </div>
                <h1 className="font-bold text-2xl md:text-3xl">Error!</h1>
                <p className=" mb-4">{error.message}</p>
                <Link to="." className="text-blue-500 hover:text-blue-400 underline">Try again</Link>
            </div>
        </div>
    );
}

// function logDetails(email, amount, transactionType) {
//     const fs = require('fs');
//     let content = null;

//     let date = new Date().toDateString() + ' ' + new Date().toLocaleTimeString();
//     content = `User ${email} made ${transactionType} payment of Ksh ${amount} on ${date}.  \n`;
//     fs.appendFile('./transactionLogs.txt', content, err => {
//         if (err) {
//             console.error(err);
//         }
//     });
// }