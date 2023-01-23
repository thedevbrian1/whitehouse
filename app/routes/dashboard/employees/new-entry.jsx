import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { useRef, useEffect } from "react";
import Heading from "../../../components/Heading";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { badRequest, validateEmail, validateName, validateNationalId, validatePhone, validateAmount } from "../../../utils";
import { createEmployee } from "../../../models/employee.server";
import Label from "~/components/Label";
import { getSession, sessionStorage } from "~/session.server";
import Input from "~/components/Input";


export async function action({ request }) {
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

    const session = await getSession(request);
    session.flash('success', true);

    return redirect('/dashboard/employees', {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}
//TODO: Log file
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
            <h2 className=" text-light-black text-lg font-semibold">Enter employee details below</h2>
            <Form method="post" className="w-4/5 sm:w-3/4 lg:max-w-5xl">
                <fieldset className="grid lg:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor='name' text='Name' />
                        <Input
                            ref={nameRef}
                            type="text"
                            name="name"
                            id="name"
                            placeholder='John Doe'
                            fieldError={actionData?.fieldErrors.name}
                        />
                    </div>
                    <div>
                        <Label htmlFor='phone' text='Phone' />
                        <Input
                            ref={phoneRef}
                            type="text"
                            name="phone"
                            id="phone"
                            placeholder='0712 345 678'
                            fieldError={actionData?.fieldErrors.phone}
                        />
                    </div>
                    <div>
                        <Label htmlFor='nationalId' text='National id' />
                        <Input
                            ref={nationalIdRef}
                            type="number"
                            name="nationalId"
                            id="nationalId"
                            fieldError={actionData?.fieldErrors.nationalId}
                        />
                    </div>
                    <div>
                        <Label htmlFor='email' text='Email' />
                        <Input
                            ref={emailRef}
                            type="email"
                            name="email"
                            id="email"
                            placeholder='johndoe@gmail.com'
                            fieldError={actionData?.fieldErrors.email}
                        />
                    </div>
                    <div>
                        <Label htmlFor='salary' text='Salary' />
                        {/* TODO: Salary should be a number */}
                        <Input
                            ref={salaryRef}
                            type="text"
                            name="salary"
                            id="salary"
                            fieldError={actionData?.fieldErrors.salary}
                        />
                    </div>
                    <button type="submit" className="lg:col-span-2 bg-blue-600 px-6 py-2 text-white text-center w-full lg:w-1/2  rounded focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {transition.submission ? 'Adding...' : 'Add'}
                    </button>
                </fieldset>
            </Form>

        </div>
    );
}