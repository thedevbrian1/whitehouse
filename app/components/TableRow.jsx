export default function TableRow({ tableData }) {
    return (
        <tr>
            {
                tableData.map((data) => (
                    <td className="border border-slate-300 text-center py-2 text-light-black text-sm lg:text-base px-6">
                        {data}
                    </td>

                ))
            }
        </tr>
    )
}