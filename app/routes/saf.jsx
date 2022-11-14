import { json, redirect } from "@remix-run/server-runtime";
import { EventEmitter } from "events";
import { eventStream } from "~/eventStream";

const EVENTS = {
    ISSUE_CHANGED: "ISSUE CHANGED"
};

const emitter = new EventEmitter();

let m = 0;
export function loader({ request }) {
    // emitter.on('event', () => {
    //     ++m;
    //     console.log(m);
    // })
    return eventStream(request, send => {
        let handler = (message) => {
            send("message", message);
        };

        emitter.addListener(EVENTS.ISSUE_CHANGED, handler);
        return () => {
            emitter.removeListener(EVENTS.ISSUE_CHANGED, handler);
        }
    });

    // return new Response("data: " + `success\n\n`, {
    //     headers: {
    //         "Content-Type": "text/event-stream"
    //     }
    // });
}

export async function action({ request }) {
    console.log('Log from saf action');
    const safRes = await request.json();
    console.log({ safRes });

    emitter.emit(EVENTS.ISSUE_CHANGED, 'Hello');
    // if (safRes.success === true) {
    // }
    // emitter.emit('event');

    return json({ safRes });
    // return 'ok';
}