import { json } from "@remix-run/node";
import { Form, Link, useFetcher } from "@remix-run/react";
import { useId } from "react";
import invariant from "tiny-invariant";
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption, ComboboxPopover } from "@reach/combobox";
import comboboxStyles from "@reach/combobox/styles.css";
import { useSpinDelay } from 'spin-delay'
import { requireUser } from "~/session.server";
import { searchEmployees } from "~/models/employee.server";
import Spinner from "~/components/Spinner";


export function links() {
    return [
        {
            rel: 'stylesheet',
            href: comboboxStyles
        }
    ];
}
export async function loader({ request }) {
    await requireUser(request);
    const url = new URL(request.url);
    const query = url.searchParams.get('query');
    console.log({ query });
    invariant(typeof query === 'string', 'query is required');
    const employees = await searchEmployees(query);
    if (!employees) {
        throw new Response('No employees found!', {
            status: 404
        });
    }
    return json({ employees });
}

export function EmployeeCombobox() {
    const fetcher = useFetcher();
    console.log({ data: fetcher.data });
    const id = useId();
    const employees = [];

    const busy = fetcher.state != 'idle';
    const showSpinner = useSpinDelay(busy, {
        delay: 150,
        minDuration: 500
    });
    return (
        <fetcher.Form method="get" action="/resources/employees">
            <Combobox aria-label="Choose an employee">
                <div className="relative">
                    <ComboboxInput
                        name="query"
                        placeholder="Type employee name or phone"
                        onChange={(event) => fetcher.submit(event.target.form)}
                        className="w-full px-3 py-2 border  rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/* {fetcher.state === "submitting"
                        ? 
                        : null
                    } */}
                    <Spinner showSpinner={showSpinner} />
                </div>
                {fetcher.data
                    ? (
                        <ComboboxPopover className="border border-slate-100">
                            {fetcher.data.error
                                ? (<p>Failed to load data</p>)
                                : fetcher.data.employees.length
                                    ? (
                                        <ComboboxList className="text-gray-800">
                                            {fetcher.data.employees.map((result) => (
                                                <Link to={result.id} key={result.id}>
                                                    <ComboboxOption

                                                        value={`${result.name} (${result.mobile})`}
                                                        className="px-2 py-3"
                                                    />
                                                </Link>
                                            ))}
                                        </ComboboxList>
                                    )
                                    : <span>No results found</span>
                            }
                        </ComboboxPopover>
                    )
                    : null
                }
                {/* <ComboboxPopover>
                    <ComboboxList>
                        <ComboboxOption value="Apple" />
                        <ComboboxOption value="Banana" />
                        <ComboboxOption value="Orange" />
                        <ComboboxOption value="Pineapple" />
                    </ComboboxList>
                </ComboboxPopover> */}
            </Combobox>
        </fetcher.Form>
    )
}

// export default function Example() {
//     const exFetcher = useFetcher();
//     return (
//         <Form method="get" action="/resources/employees">
//             <input
//                 name="query"
//                 type="text"
//                 className="border border-black"
//                 onChange={(event) => exFetcher.submit(event.target.form)}
//             />
//             <button>Submit</button>
//         </Form>
//     )
// }

























// export async function loader({ request }) {
//     await requireUser(request);
//     const url = new URL(request.url);
//     const query = url.searchParams.get('query');
//     invariant(typeof query === 'string', 'query is required');
//     return json({
//         customers: await searchCustomers(query),
//     });
// }

// export function CustomerCombobox({ error }) {
//     //Fetcher
//     const customerFetcher = useFetcher();
//     const id = useId();
//     const customers = customerFetcher.data?.customers ?? [];
//     // type Customer = typeof customers[number];

//     const [selectedCustomer, setSelectedCustomer] = useState(null);

//     const cb = useCombobox({
//         id,
//         onSelectedItemChange: ({ selectedItem }) => {
//             setSelectedCustomer(selectedItem)
//         },
//         items: customers,
//         itemToString: item => (item ? item.name : ''),
//         onInputValueChange: changes => {
//             // Fetch here
//             customerFetcher.submit(
//                 { query: changes.inputValue ?? '' },
//                 { method: 'get', action: '/resources/customers' }
//             )
//         },
//     });

//     // Add pending state
//     const busy = customerFetcher.state !== 'idle';
//     const showSpinner = useSpinDelay(busy, {
//         delay: 150,
//         minDuration: 500
//     });
//     const displayMenu = cb.isOpen && customers.length > 0;

//     return (
//         <div className="relative">
//             <input
//                 type="hidden"
//                 name="customerId"
//                 value={selectedCustomer?.id ?? ''}
//             />
//             <div className="flex flex-wrap items-center gap-1">
//                 <label {...cb.getLabelProps()}>
//                     <LabelText>Customer</LabelText>
//                 </label>
//                 {error ? (
//                     <em id="customer-error" className="text-d-p-xs text-red-600">
//                         {error}
//                     </em>
//                 ) : null}
//             </div>
//             <div {...cb.getComboboxProps({ className: 'relative' })}>
//                 <input
//                     {...cb.getInputProps({
//                         className: clsx('text-lg w-full border border-gray-500 px-2 py-1', {
//                             'rounded-t rounded-b-0': displayMenu,
//                             rounded: !displayMenu,
//                         }),
//                         'aria-invalid': Boolean(error) || undefined,
//                         'aria-errormessage': error ? 'customer-error' : undefined,
//                     })}
//                 />

//                 {/* Spinner */}
//                 <Spinner showSpinner={showSpinner} />
//             </div>
//             <ul
//                 {...cb.getMenuProps({
//                     className: clsx(
//                         'absolute z-10 bg-white shadow-lg rounded-b w-full border border-t-0 border-gray-500 max-h-[180px] overflow-scroll',
//                         { hidden: !displayMenu },
//                     ),
//                 })}
//             >
//                 {displayMenu
//                     ? customers.map((customer, index) => (
//                         <li
//                             className={clsx('cursor-pointer py-1 px-2', {
//                                 'bg-green-200': cb.highlightedIndex === index,
//                             })}
//                             key={customer.id}
//                             {...cb.getItemProps({ item: customer, index })}
//                         >
//                             {customer.name} ({customer.email})
//                         </li>
//                     ))
//                     : null}
//             </ul>
//         </div>
//     );
// }

