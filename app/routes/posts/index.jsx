import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPostListings } from "../../models/post.server";
import { useOptionalUser } from "../../utils";

export async function loader() {
    const posts = await getPostListings();
    return json({ posts });
}
// TODO: List posts for owner, not all posts
export default function Posts() {
    const { posts } = useLoaderData();
    const user = useOptionalUser();
    const isAdmin = user?.email === 'rachel@remix.run';
    return (
        <main>
            <h1>Posts</h1>
            {isAdmin
                ? (<Link to="admin" className="text-red-600 underline">
                    Admin
                </Link>)
                : null
            }

            <ul>
                {posts.map((post, index) => (
                    <li key={index} className="text-blue-500 underline">
                        <Link to={post.slug} prefetch="intent">
                            {post.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}