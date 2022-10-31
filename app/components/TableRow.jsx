export default function TableRow({ tableData }) {
    return (
        <tr>
            {
                tableData.map((data) => (
                    <td className="border border-slate-300 text-center py-2 text-light-black" key={tableData.id}>
                        {data}
                    </td>

                ))
            }
        </tr>
    )
}