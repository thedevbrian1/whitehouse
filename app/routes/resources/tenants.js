import { json } from "@remix-run/node";
import { Link, useFetcher } from "@remix-run/react";
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption, ComboboxPopover } from "@reach/combobox";
import comboboxStyles from "@reach/combobox/styles.css";
import { useSpinDelay } from "spin-delay";
import invariant from "tiny-invariant";
import Spinner from "~/components/Spinner";
import { searchTenants } from "~/models/tenant.server";
import { requireUser } from "~/session.server";

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

    invariant(typeof query === 'string', 'query is required');

    let trimmedQuery = query.trim().split(' ').join('');
    const tenants = await searchTenants(trimmedQuery);
    if (!tenants) {
        throw new Response('No employees found!', {
            status: 404
        });
    }
    return json({ tenants });
}

export function TenantCombobox() {
    const fetcher = useFetcher();
    const busy = fetcher.state != 'idle';
    const showSpinner = useSpinDelay(busy, {
        delay: 150,
        minDuration: 500
    });
    return (
        <fetcher.Form method="get" action="/resources/tenants">
            <Combobox aria-label="choose a tenant">
                <div className="relative">
                    <ComboboxInput
                        name="query"
                        placeholder="Type tenant name or phone"
                        onChange={(event) => fetcher.submit(event.target.form)}
                        className="w-full px-3 py-2 border  rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Spinner showSpinner={showSpinner} />
                </div>
                {fetcher.data
                    ? (
                        <ComboboxPopover className="border border-slate-100">
                            {fetcher.data.error
                                ? (<p>Failed to load data</p>)
                                : fetcher.data.tenants.length
                                    ? (
                                        <ComboboxList className="text-gray-800">
                                            {fetcher.data.tenants.map((tenant) => (
                                                <Link to={tenant.id} key={tenant.id}>
                                                    <ComboboxOption
                                                        value={`${tenant.name}  (Plot: ${tenant.house.plotNumber} / House: ${tenant.house.houseNumber})`}
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
            </Combobox>
        </fetcher.Form>
    );
}