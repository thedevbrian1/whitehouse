import { Outlet } from "@remix-run/react";

export function meta() {
    return {
        title: 'Employees | White House Court',
        // description: 'Register as a White House Court tenant'
    };
}

export default function Employees() {
    return (
        <Outlet />
    )
}