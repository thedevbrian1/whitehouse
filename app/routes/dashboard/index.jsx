import DashboardCard from "../../components/DashboardCard";
import { getTransactions } from "~/models/transaction.server";
import { useLoaderData } from "@remix-run/react";

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
            amount: 'Ksh 50,000',
        },
        {
            title: 'Total registered tenants',
            amount: '20',
        },
        {
            title: 'Total employees',
            amount: '50',
        },
    ];
    // const totalAmount = data.reduce((prev, current) => prev.amount + current.amount);

    return (
        <div className="grid md:grid-cols-2 gap-5 lg:w-3/4">
            {details.map((detail, index) => (
                <DashboardCard key={index} title={detail.title} amount={detail.amount} />
            ))}

        </div>
    )
}
