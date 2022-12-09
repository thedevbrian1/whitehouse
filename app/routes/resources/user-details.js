import { getSession } from "~/session.server";

export async function action({ request }) {
    const formData = await request.formData();
    console.log({ formData });
    const session = await getSession(request);

    return null;
}