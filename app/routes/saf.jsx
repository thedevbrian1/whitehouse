import { json, redirect } from "@remix-run/server-runtime";
import { getSession, sessionStorage } from "~/session.server";

export async function loader({ request }) {
    const session = await getSession(request);
    const safRes = session.get('safaricomResponse');
    return json({ safRes }, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}

export async function action({ request }) {
    const safRes = await request.body;
    console.log({ safRes });
    const session = await getSession(request);
    session.flash('safaricomResponse', safRes);
    return redirect('/saf', {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}