export default function DashboardCard({ title, amount }) {
    return (
        <div className="bg-[#f8f8ff] w-96 h-44 grid place-items-center">
            <div>
                <p className="font-semibold uppercase text-center text-light-black">{title}</p>
                <p className="font-bold text-2xl mt-3 text-center">{amount}</p>
            </div>
        </div>
    )
}