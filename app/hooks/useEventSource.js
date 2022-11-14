import { useState, useEffect } from "react";

export function useEventSource(href) {
    let [data, setData] = useState("");

    useEffect(() => {
        let eventSource = new EventSource(href);
        let handler = (event) => setData(event.data);
        eventSource.addEventListener("message", handler);
        return () => eventSource.close();
    }, [href]);

    return data;
}