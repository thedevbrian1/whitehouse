export default function Table({ tableHeadings }) {
    return (
        <table className="mt-2 border border-slate-400 border-collapse w-full table-auto">
            <thead>
                <tr className="bg-slate-100">

                    {tableHeadings.map((tableHeading, index) => (
                        <th className="border border-slate-300" key={index}>
                            {tableHeading}
                        </th>
                    ))}
                </tr>

            </thead>
            <tbody>
                {/* {actionData
                            ? (actionData?.map((house) => (
                                <TableRow house={house} key={house.id} />
                            )))
                            : plotOneHouses.map(house => (
                                <TableRow house={house} key={house.id} />
                            ))
                        } */}
                {/* {fetcher.data
                            ? (fetcher.data?.map((house) => (
                                <TableRow house={house} key={house.id} />
                            )))
                            : data.map(house => (
                                <TableRow house={house} key={house.id} />
                            ))
                        } */}
            </tbody>
        </table>
    );
}

function TableRow({ house }) {
    return (
        <tr>
            {tableData.map((data, index) => (
                <td className="border border-slate-300 text-center py-2">
                    {house.houseNumber}
                </td>
            ))}
            <td className="border border-slate-300 text-center py-2">
                {house.houseNumber}
            </td>
            <td className="border border-slate-300 text-center hover:underline hover:text-blue-500">
                <Link to={`${house.plotNumber} / ${house.houseNumber}`}>{house.tenant.name}</Link>
            </td>
            <td className="border border-slate-300 text-center">
                {house.tenant.mobile}
            </td>
            <td className="border border-slate-300 text-center">
                {new Date(house.moveInDate).toLocaleDateString()}
            </td>
            <td className="border border-slate-300 text-center">
                {house.arrears}
            </td>
            <td className="border border-slate-300 text-center">
                30/7/2022
            </td>
        </tr>
    );
}