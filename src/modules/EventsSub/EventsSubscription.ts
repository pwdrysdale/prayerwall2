import { Field, ObjectType, Resolver, Subscription, Root } from "type-graphql";
import { v4 as uuid } from "uuid";

@ObjectType()
export class EventInput {
    @Field()
    event: string;
}

@ObjectType()
export class Event {
    @Field()
    id: String;

    @Field()
    event: string;

    @Field()
    date: Date;
}

@Resolver()
export class EventsSubscription {
    @Subscription(() => Event, { topics: "EVENTS" })
    newEvent(
        @Root()
        { event }: EventInput
    ): Event {
        return { event, date: new Date(), id: uuid() };
    }
}
