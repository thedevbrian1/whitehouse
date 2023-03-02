import { Form, Link, useActionData, useSearchParams, useTransition } from "@remix-run/react";
import { nodemailer, redirect} from "@remix-run/node";
import { sendEmail, makeId } from "~/utils";
import { getUserByEmail, updateUserPassword } from "~/models/user.server";
// import { useRef } from "react";

export async function action({ request }){
    // const nodemailer = require('nodemailer');
    const formData = await request.formData();

    const emailTo = formData.get('email');
    console.log( { emailTo });

    const Mailjet = require('node-mailjet');
    const mailjet = Mailjet.apiConnect(
        process.env.MJ_APIKEY_PUBLIC,
        process.env.MJ_APIKEY_PRIVATE,
    );

    // const message = "countYour2023";

    // return redirect('/login');
    // console.log(makeId(8));

    return updateUserPassword(emailTo);

}

export default function RecoverPassword(){
    const transition = useTransition();
    return(       
        <div className="flex min-h-full flex-col justify-center">
            <div className="mx-auto w-full max-w-md px-8">
                <Form method="post" className="space-y-3">
                    <label htmlFor="email" className="font-semibold text-lg">Enter your Email Address</label>
                    <input className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" name="email"/> 
                    <p className="text-xs">An email will be sent with a password to log in</p>
                    <p className="text-xs">Log in and make sure to change your password to make your account secure</p>
                    {/* <input type="submit" value="Receive Recovery Password" name="btnForget" className=""/> */}
                    <button
                        type="submit"
                        className="w-full rounded bg-blue-500 space-y-4 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
                    >
                        {transition.submission ? 'Sending...' : 'Send Recovery password'}
                    </button>
                </Form>
            </div>
        </div>
    );
}