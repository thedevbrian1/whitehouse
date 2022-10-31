import { Form, Link, useLoaderData, useActionData, useTransition, useCatch, useParams } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { marked } from "marked";
import { createPost, deletePost, getPost, updatePost } from "../../../models/post.server";
import { requireAdminUser } from "../../../session.server";

export async function loader({ params, request }) {
    await requireAdminUser(request);
    if (params.slug === 'new') {
        return json({});
    }
    const post = await getPost(params.slug);
    if (!post) {
        throw new Response('Not found', { status: 404 });
    }

    return json({ post });
}

export async function action({ request, params }) {
    await requireAdminUser(request);

    const formData = await request.formData();
    const action = formData.get('_action');

    if (action === 'delete') {
        await deletePost(params.slug);
        return redirect('/posts/admin');
    }
    const title = formData.get('title');
    const slug = formData.get('slug');
    const markdown = formData.get('markdown');

    const errors = {
        title: title ? null : 'Title is required',
        slug: slug ? null : 'Slug is required',
        markdown: markdown ? null : 'Markdown is required'
    };

    if (Object.values(errors).some(Boolean)) {
        return json(errors);
    }

    if (params.slug === 'new') {
        await createPost({ title, slug, markdown });
    } else {
        await updatePost(params.slug, { title, slug, markdown });
    }

    return redirect('/posts/admin');
}

export default function NewPost() {
    const data = useLoaderData();
    const errors = useActionData();
    const transition = useTransition();
    let isCreating = transition.submission?.formData.get('_action') === 'create';
    let isUpdating = transition.submission?.formData.get('_action') === 'update';
    let isDeleting = transition.submission?.formData.get('_action') === 'delete';
    let isNewPost = !data.post;

    return (
        <Form method="post" key={data.post?.slug ?? 'new'}>
            {/* TODO: Read about nullish coalescing operand */}
            <p>
                <label>
                    Post Title:
                    {errors?.title
                        ? <em className="text-red-600">{errors.title}</em>
                        : <>&nbsp;</>
                    }
                    <input
                        type="text"
                        name="title"
                        className="border-2 border-black focus:border-none focus:outline-none focus:ring focus:ring-blue-500 text-black p-4 block h-8 w-full rounded-lg"
                        defaultValue={data.post?.title}
                    />
                </label>
            </p>
            <p className="mt-4">
                <label>
                    Post slug:
                    {errors?.slug
                        ? <em className="text-red-600">{errors.slug}</em>
                        : <>&nbsp;</>
                    }
                    <input
                        type="text"
                        name="slug"
                        className="border-2 border-black focus:border-none focus:outline-none focus:ring focus:ring-blue-500 text-black p-4 block h-8 w-full rounded-lg"
                        defaultValue={data.post?.slug}
                    />
                </label>
            </p>
            <p className="mt-4">
                <label>
                    Markdown:
                    {errors?.markdown
                        ? <em className="text-red-600">{errors.markdown}</em>
                        : <>&nbsp;</>
                    }
                    <textarea
                        name="markdown"
                        // cols="30"
                        rows="10"
                        className="border-2 border-black focus:border-none focus:outline-none focus:ring focus:ring-blue-500 text-black p-4 w-full block rounded"
                        defaultValue={data.post?.markdown}
                    />
                </label>
            </p>
            <div className="mt-4 flex justify-end gap-4">
                {isNewPost
                    ? null
                    : <button
                        type="submit"
                        name="_action"
                        value='delete'
                        className="bg-red-500 px-4 py-2 text-white disabled:bg-red-200"
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                }
                <button
                    type="submit"
                    name="_action"
                    value={isNewPost ? 'create' : 'update'}
                    className="bg-blue-500 px-4 py-2 text-white disabled:bg-blue-200"
                    disabled={isCreating || isUpdating}
                >
                    {isNewPost
                        ? (isCreating ? 'Creating...' : 'Create post')
                        : (isUpdating ? 'Updating...' : 'Update post')
                    }

                </button>
            </div>
        </Form>
    )
}

export function CatchBoundary() {
    const caught = useCatch();
    const params = useParams();

    if (caught.status === 404) {
        return (
            <div>
                Uh oh! This post with the slug "{params.slug}" does not exist
            </div>
        );
    }
    throw new Error(`Unsupported thrown response status code: ${caught.status}`);
}

export function ErrorBoundary({ error }) {
    return (
        <div className="text-red-500">
            Oh no! Something went wrong.
            <pre>{error.message}</pre>
        </div>
    )
}