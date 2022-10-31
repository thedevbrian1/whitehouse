import { Link } from "@remix-run/react";
import { requireAdminUser } from "../../../session.server";

export async function loader({ request }) {
    await requireAdminUser(request);
    return null;
}

export default function AdminIndex() {
    return (
        <div>
            <Link to="new" className="text-blue-600 underline">Create new post</Link>
        </div>
    )
}