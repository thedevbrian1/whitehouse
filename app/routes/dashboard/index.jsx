import DashboardCard from "../../components/DashboardCard";
import { getTransactions } from "~/models/transaction.server";
import { Link, useCatch, useLoaderData } from "@remix-run/react";
import { getTenants } from "~/models/tenant.server";
import { getEmployees } from "~/models/employee.server";
import { json } from "@remix-run/server-runtime";

// TODO: Display correct amount from the database
// TODO: Display vacant houses from the database

export function meta() {
    return {
        title: 'Dashboard | Estate control'
    };
}

export async function loader() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Intl.DateTimeFormat("en-US", { month: 'long' }).format(new Date());

    const transactions = await getTransactions();

    const annualTotalAmount = transactions.filter(transaction => transaction.paidYear === String(currentYear)).map(transaction => transaction.amount).reduce((prev, current) => prev + current);

    const monthlyTotalAmount = transactions.filter(transaction => (transaction.paidYear === String(currentYear)) && (transaction.paidMonth === String(currentMonth))).map(transaction => transaction.amount).reduce((prev, current) => prev + current);

    const tenants = await getTenants();
    const numberOfTenants = tenants.length;

    const employees = await getEmployees();
    const numberOfEmployees = employees.length;

    return json({ numberOfEmployees, numberOfTenants, annualTotalAmount, monthlyTotalAmount });
}

export default function DashboardIndex() {
    const data = useLoaderData();

    const details = [
        {
            title: 'Annual total',
            amount: `Ksh ${data.annualTotalAmount}`,
        },
        {
            title: 'Monthly total',
            amount: `Ksh ${data.monthlyTotalAmount}`,
        },
        {
            title: 'Number of Tenants',
            amount: data.numberOfTenants,
        },
        {
            title: 'Total employees',
            amount: data.numberOfEmployees,
        },
    ];
    // const totalAmount = data.reduce((prev, current) => prev.amount + current.amount);

    return (
        <div className="grid md:grid-cols-2 gap-5 lg:w-3/4">
            {details.map((detail, index) => (
                <DashboardCard key={index} title={detail.title} amount={detail.amount} />
            ))}

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
