import { Form, Link, useActionData, useTransition } from "@remix-run/react";
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
// import algoliasearch from "algoliasearch";
import Label from "~/components/Label";

// const searchClient = algoliasearch('KG5XNDOMR2', 'cfeaac376bb4e97c121d8056ba0dbb48');
// const index = searchClient.initIndex('tenants');


export async function loader() {
    const tenants = await getTenants();
    // console.log({ tenants });
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

    const tenant = await createTenant(name, phone, email, Number(nationalId), moveInDate, vehicleRegistration);

    const tenantId = tenant.id;

    const res = await createHouse(Number(plotNo), houseNo, tenantId);
    // console.log({ res });

    const user = await createUser(email, password);

    // const algoliaTenantRecord = { name, phone, tenantId, email, houseNo, plotNo };
    // const re = await index.saveObject(algoliaTenantRecord, { autoGenerateObjectIDIfNotExist: true });
    // console.log({ re });

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
        <div className="space-y-4 max-w-5xl mx-auto">
            <Link to=".." className="text-black hover:underline hover:text-blue-500">
                <ArrowLeftIcon className="w-5 h-5 inline" /> Back to tenants
            </Link>
            <Heading title='Add tenant' />
            <p className="text-light-black"><em>(Fields marked with * are compulsory)</em></p>
            <Form method="post">
                <fieldset >
                    <div className="grid lg:grid-cols-2 gap-1 lg:gap-x-5">
                        <div>
                            {/* <label htmlFor="name" className="text-black">
                                Full name *
                            </label> */}
                            <Label htmlFor='name' text='Full name *' />
                            <input
                                ref={nameRef}
                                type="text"
                                name="name"
                                id="name"
                                // defaultValue={actionData?.fields.name}
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
                            {/* <label htmlFor="phone" className="text-black">
                                Phone *
                            </label> */}
                            <Label htmlFor='phone' text='Phone *' />
                            <input
                                ref={phoneRef}
                                type="text"
                                name="phone"
                                id="phone"
                                // defaultValue={actionData?.fields.phone}
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
                            {/* <label htmlFor="nationalId" className="text-black">
                                National Id *
                            </label> */}
                            <Label htmlFor='nationalId' text='National id *' />
                            <input
                                ref={nationalIdRef}
                                type="number"
                                name="nationalId"
                                id="nationalId"
                                maxLength={8}
                                defaultValue={actionData?.fields.nationalId}
                                className={`block w-full px-3 py-2 border rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${actionData?.fieldErrors.nationalId ? 'border-red-700' : 'border-gray-400'}`}
                            />
                            {
                                actionData?.fieldErrors.nationalId
                                    ? (<span className="pt-1 text-red-700 text-sm" id="email-error">
                                        {actionData.fieldErrors.nationalId}
                                    </span>)
                                    : <>&nbsp;</>
                            }
                        </div>
                        {/* <div>
                        <label htmlFor="email" className="text-black">
                            Email *
                        </label>
                        <input
                            ref={emailRef}
                            type="email"
                            name="email"
                            id="email"
                            defaultValue={actionData?.fields.email}
                            className={`block w-full px-3 py-2 border rounded text-black invalid:border-pink-500 invalid:text-pink-600 focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${actionData?.fieldErrors.email ? 'border-red-700' : 'border-gray-400'}`}
                        />
                        {
                            actionData?.fieldErrors.email
                                ? (<span className="pt-1 text-red-700 text-sm" id="email-error">
                                    {actionData.fieldErrors.email}
                                </span>)
                                : <>&nbsp;</>
                        }
                    </div> */}
                        <div>
                            {/* <label htmlFor="plotNo" className="text-black">
                                Plot number *
                            </label> */}
                            <Label htmlFor='plotNo' text='Plot number *' />
                            <input
                                ref={plotNoRef}
                                type="number"
                                name="plotNo"
                                id="plotNo"
                                min={1}
                                max={67}
                                defaultValue={actionData?.fields.salary}
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
                            <input
                                ref={houseNoRef}
                                type="text"
                                name="houseNo"
                                id="houseNo"
                                defaultValue={actionData?.fields.houseNo}
                                className={`block w-full px-3 py-2 border rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${actionData?.fieldErrors.houseNo ? 'border-red-700' : 'border-gray-400'}`}
                            />
                            {
                                actionData?.fieldErrors.houseNo
                                    ? (<span className="pt-1 text-red-700 text-sm" id="email-error">
                                        {actionData.fieldErrors.houseNo}
                                    </span>)
                                    : <>&nbsp;</>
                            }
                        </div>
                        <div>
                            {/* <label htmlFor="date" className="text-black">
                                Move in date
                            </label> */}
                            <Label htmlFor='date' text='Move in date' />
                            <input
                                ref={dateRef}
                                type="date"
                                name="date"
                                id="date"
                                defaultValue={actionData?.fields.moveInDate}
                                className={`block w-full px-3 py-2 border rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${actionData?.fieldErrors.moveInDate ? 'border-red-700' : 'border-gray-400'}`}
                            />
                            {
                                actionData?.fieldErrors.moveInDate
                                    ? (<span className="pt-1 text-red-700 text-sm" id="email-error">
                                        {actionData.fieldErrors.moveInDate}
                                    </span>)
                                    : <>&nbsp;</>
                            }
                        </div>
                        <div>
                            {/* <label htmlFor="vehicleRegistration" className="text-black">
                                Vehicle registration
                            </label> */}
                            <Label htmlFor='vehicleRegistration' text='Vehicle registration' />
                            <input
                                ref={vehicleRegRef}
                                type="text"
                                name="vehicleRegistration"
                                id="vehicleRegistration"
                                defaultValue={actionData?.fields.vehicleRegistration}
                                className={`block w-full px-3 py-2 border rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${actionData?.fieldErrors.vehicleRegistration ? 'border-red-700' : 'border-gray-400'}`}
                            />
                            {
                                actionData?.fieldErrors.vehicleRegistration
                                    ? (<span className="pt-1 text-red-700 text-sm" id="email-error">
                                        {actionData.fieldErrors.vehicleRegistration}
                                    </span>)
                                    : <>&nbsp;</>
                            }
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
                            <Label htmlFor='password' text='Password *' />
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
                    <button type="submit" className="lg:col-span-2 bg-blue-600 px-6 py-2 text-white text-center w-full lg:w-1/2 justify-self-center rounded focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {transition.submission ? 'Adding...' : 'Add'}
                    </button>
                </fieldset>
            </Form>
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