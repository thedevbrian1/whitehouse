export default function TableHeader({ tableHeadings }) {
    return (
        <tr className="bg-slate-100">
            {
                tableHeadings.map((heading, index) => (
                    <th className="border border-slate-300 py-1" key={index}>
                        {heading}
                    </th>
                ))
            }
        </tr>
    )
}