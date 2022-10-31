import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { marked } from "marked";
import { getPost } from "../../models/post.server";

export async function loader({ params }) {
    const slug = params.slug;
    console.log({ slug });
    const post = await getPost(slug);
    const parsedHtml = marked(post.markdown);

    return json({ title: post.title, parsedHtml });
}

export default function PostRoute() {
    const { title, parsedHtml } = useLoaderData();
    return (
        <main className="mx-auto max-w-4xl">
            <h1 className="my-6 border-b-2 text-center text-3xl">{title}</h1>
            <div dangerouslySetInnerHTML={{ __html: parsedHtml }} />
        </main>
    )
}