export default function TableHeader({ tableHeadings }) {
    return (
        <tr className="bg-slate-100">
            {
                tableHeadings.map((heading, index) => (
                    <th className="font-xs lg:font-base border border-slate-300 py-2 px-4 text-sm lg:text-base" key={index}>
                        {heading}
                    </th>
                ))
            }
        </tr>
    )
}