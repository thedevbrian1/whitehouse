import DashboardCard from "../../components/DashboardCard";

// TODO: Display correct amount from the database
// TODO: Display vacant houses from the database

export function meta() {
    return {
        title: 'Dashboard | Estate control'
    };
}
export default function DashboardIndex() {
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
            title: 'Total vacant houses',
            amount: '20',
        },
        {
            title: 'Total employees',
            amount: '50',
        },
    ];
    return (
        <div className="flex flex-wrap gap-5">
            {details.map((detail, index) => (
                <DashboardCard key={index} title={detail.title} amount={detail.amount} />
            ))}

        </div>
    )
}
