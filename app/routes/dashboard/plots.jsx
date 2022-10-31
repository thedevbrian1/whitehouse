import { Link, Outlet, useCatch } from "@remix-run/react";

export function meta() {
    return {
        title: 'Tenants | White House Court',
        // description: 'Register as a White House Court tenant'
    };
}
export default function Plots() {
    return (
        <Outlet />
    );
}

export function CatchBoundary() {
    const caught = useCatch();
    return (
        <div>
            <p>Error!</p>
            <p>Status {caught.status}</p>
            <pre>
                <code>
                    {caught.data}
                </code>
            </pre>
            <Link to="new-entry" className="text-blue-500 underline">
                Create new tenant
            </Link>
        </div>
    )

}

export function ErrorBoundary() {
    return (
        <div>
            Oops!! There was an error
        </div>
    )
}