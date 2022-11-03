export default function TableHeader({ tableHeadings }) {
    return (
        <tr className="bg-slate-100">
            {
                tableHeadings.map((heading, index) => (
                    <th className="border border-slate-300 p-2 text-sm lg:text-base" key={index}>
                        {heading}
                    </th>
                ))
            }
        </tr>
    )
}