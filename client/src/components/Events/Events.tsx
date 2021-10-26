import { useSubscription } from "@apollo/client";
import React, { useEffect } from "react";

import { loader } from "graphql.macro";

const EventsSubscription = loader("./getEvents.graphql");

interface Event {
    event: string;
    id: string;
    date: Date;
}

const Events = () => {
    const [events, setEvents] = React.useState<Event[]>([]);

    const { data } = useSubscription(EventsSubscription);

    useEffect(() => {
        console.log(data);
        if (data?.newEvent) {
            setEvents((events: Event[]) =>
                [...events, data.newEvent].filter(
                    (event: Event, idx: number, self: Event[]) =>
                        self.indexOf(event) === idx
                )
            );
        }
    }, [data]);

    return (
        <div>
            <h1>This is the events</h1>
            {events.map((event: any) => (
                <div key={event.id}>{event.event}</div>
            ))}
        </div>
    );
};

export default Events;
