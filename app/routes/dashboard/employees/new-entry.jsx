import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { useRef, useEffect } from "react";
// import algoliasearch from "algoliasearch";

// import { useState } from "react";
// import { Dialog } from "@reach/dialog";
// import { VisuallyHidden } from "@reach/visually-hidden";
import Heading from "../../../components/Heading";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { badRequest, validateEmail, validateName, validateNationalId, validatePhone, validateAmount } from "../../../utils";
import { createEmployee } from "../../../models/employee.server";
import Label from "~/components/Label";
import { getSession, sessionStorage } from "~/session.server";

// const searchClient = algoliasearch('KG5XNDOMR2', 'cfeaac376bb4e97c121d8056ba0dbb48');
// const index = searchClient.initIndex('employees');

export async function action({ request }) {
    // const formData = Object.fromEntries(await request.formData());
    // const searchClient = algoliasearch(process.env.ALGOLIA_PROJECT_ID, process.env.ALGOLIA_ADMIN_API_KEY);
    // const index = searchClient.initIndex('employees');
    const formData = await request.formData();

    const name = formData.get('name');
    const phone = formData.get('phone');
    const nationalId = formData.get('nationalId');
    const email = formData.get('email');
    const salary = formData.get('salary');

    const fields = {
        name: name,
        phone: phone,
        nationalId: nationalId,
        email: email,
        salary: salary,
    };

    const fieldErrors = {
        name: validateName(name),
        phone: validatePhone(phone),
        nationalId: validateNationalId(nationalId),
        email: validateEmail(email),
        salary: validateAmount(salary),
    };

    // Return errors if any

    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fields, fieldErrors });
    }

    // Create new employee
    const employee = await createEmployee(name, phone, email, nationalId, salary);
    const employeeId = employee.id;

    const session = await getSession(request);
    session.flash('success', true);
    // const algoliaTenantRecord = { name, phone, employeeId, email };
    // const re = await index.saveObject(algoliaTenantRecord, { autoGenerateObjectIDIfNotExist: true });

    // console.log({ re });
    // console.log({ employee });

    return redirect('/dashboard/employees', {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}
// TODO: Index algolia after creating employee
// Log file
// Dashboard details (dynamic)
// Record current month when tenant is paying
// Handle excess payments
// Generate reports
// List of shame

export default function NewEntry() {
    const actionData = useActionData();
    const transition = useTransition();

    const nameRef = useRef(null);
    const phoneRef = useRef(null);
    const nationalIdRef = useRef(null);
    const emailRef = useRef(null);
    const salaryRef = useRef(null);

    // const [showDialog, setShowDialog] = useState(true);

    // function open() {
    //     setShowDialog(true);
    // }

    // function close() {
    //     setShowDialog(false);
    // }
    useEffect(() => {
        nameRef.current?.focus();

        // Focus the first field with an error
        if (actionData?.fieldErrors.name) {
            nameRef.current?.focus();
        }
        else if (actionData?.fieldErrors.phone) {
            phoneRef.current?.focus();
        }
        else if (actionData?.fieldErrors.nationalId) {
            nationalIdRef.current?.focus();
        }
        else if (actionData?.fieldErrors.email) {
            emailRef.current?.focus();
        }
        else if (actionData?.fieldErrors.salary) {
            salaryRef.current?.focus();
        }
    }, [actionData]);
    return (
        <div className=" mx-auto space-y-4">
            <Link to=".." className="text-black hover:underline hover:text-blue-500">
                <ArrowLeftIcon className="w-5 h-5 inline" /> Back to employees
            </Link>
            <Heading title='Add Employee' />
            <p className="text-light-black">Enter employee details below</p>
            <Form method="post" className="w-4/5 sm:w-3/4 lg:max-w-5xl">
                <fieldset className="grid lg:grid-cols-2 gap-4">
                    <div>
                        {/* <label htmlFor="name" className="text-light-black">
                            Name
                        </label> */}
                        <Label htmlFor='name' text='Name' />
                        <input
                            ref={nameRef}
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
                        {/* <label htmlFor="phone" className="text-light-black">
                            Phone
                        </label> */}
                        <Label htmlFor='phone' text='Phone' />
                        <input
                            ref={phoneRef}
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
                        {/* <label htmlFor="nationalId" className="text-light-black">
                            National Id
                        </label> */}
                        <Label htmlFor='nationalId' text='National id' />
                        <input
                            ref={nationalIdRef}
                            type="number"
                            name="nationalId"
                            id="nationalId"
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
                    <div>
                        {/* <label htmlFor="email" className="text-light-black">
                            Email
                        </label> */}
                        <Label htmlFor='email' text='Email' />
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
                    </div>
                    <div>
                        {/* <label htmlFor="salary" className="text-light-black">
                            Salary
                        </label> */}
                        <Label htmlFor='salary' text='Salary' />
                        <input
                            ref={salaryRef}
                            type="text"
                            name="salary"
                            id="salary"
                            defaultValue={actionData?.fields.salary}
                            className={`block w-full px-3 py-2 border rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${actionData?.fieldErrors.salary ? 'border-red-700' : 'border-gray-400'}`}
                        />
                        {
                            actionData?.fieldErrors.salary
                                ? (<span className="pt-1 text-red-700 text-sm" id="email-error">
                                    {actionData.fieldErrors.salary}
                                </span>)
                                : <>&nbsp;</>
                        }
                    </div>
                    <button type="submit" className="lg:col-span-2 bg-blue-600 px-6 py-2 text-white text-center w-full lg:w-1/2 justify-self-center rounded focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {transition.submission ? 'Adding...' : 'Add'}
                    </button>
                </fieldset>
            </Form>

        </div>
    );
}