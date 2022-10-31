import { Link, Outlet, useLoaderData, useTransition } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getPostListings } from "../../models/post.server";
import { requireAdminUser } from "../../session.server";

export async function loader({ request }) {
    await requireAdminUser(request);
    return json({ posts: await getPostListings() });
}
export default function Admin() {
    const { posts } = useLoaderData();
    const transition = useTransition();
    console.log('Transition: ', transition.submission?.formData.get('title'));
    // TODO: Show post title in the list optimistically
    return (
        <div className="mx-auto max-w-4xl">
            <h1 className="my-6 mb-2 border-b-2 text-center text-3xl">Blog admin</h1>
            <div className="grid grid-cols-4 gap-6">
                <nav className="col-span-4 md:col-span-1">
                    <ul>
                        {posts.map((post) => (
                            <li key={post.slug}>
                                <Link to={post.slug} className="text-blue-600 underline">
                                    {post.title}
                                </Link>
                            </li>
                        ))}
                        {/* <li>
                            <Link className="text-blue-600 underline">

                            </Link>
                        </li> */}
                    </ul>
                </nav>
                <main className="col-span-4 md:col-span-3">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}