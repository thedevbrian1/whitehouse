import DashboardCard from "../../components/DashboardCard";
import { getTransactions } from "~/models/transaction.server";
import { Link, useCatch, useLoaderData } from "@remix-run/react";

// TODO: Display correct amount from the database
// TODO: Display vacant houses from the database

export function meta() {
    return {
        title: 'Dashboard | Estate control'
    };
}

export async function loader() {
    const transactions = await getTransactions();
    return transactions;
}

export default function DashboardIndex() {
    const data = useLoaderData();

    const details = [
        {
            title: 'Annual total',
            amount: 'Ksh 300,000',
        },
        {
            title: 'Monthly total',
            amount: 'Ksh 29,800',
        },
        {
            title: 'Number of Tenants',
            amount: '400',
        },
        {
            title: 'Total employees',
            amount: '6',
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
