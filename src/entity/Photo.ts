import { Field, ObjectType } from "type-graphql";
import { BaseEntity } from "typeorm";

@ObjectType()
class PhotoLinks {
    @Field()
    download: string;

    @Field()
    download_location: string;

    @Field()
    html: string;

    @Field()
    self: string;
}

@ObjectType()
class Position {
    @Field()
    latitude: number;

    @Field()
    longitude: number;
}

@ObjectType()
class Location {
    @Field()
    city: string;

    @Field()
    country: string;

    @Field(() => Position)
    position: Position;
}

@ObjectType()
class SponsorshipLinks {
    @Field()
    self: string;

    @Field()
    html: string;

    @Field()
    photos: string;

    @Field()
    likes: number;

    @Field()
    portfolio: string;

    @Field()
    following: string;

    @Field()
    followers: string;
}

@ObjectType()
class SponsorshipImage {
    @Field()
    small: string;

    @Field()
    medium: string;

    @Field()
    large: string;
}

@ObjectType()
class Sponsorship {
    @Field()
    id: string;

    @Field()
    updated_at: string;

    @Field()
    username: string;

    @Field()
    name: string;

    @Field()
    first_name: string;

    @Field()
    last_name: string;

    @Field()
    twitter_username: string;

    @Field()
    portfolio_url: string;

    @Field()
    bio: string;

    @Field()
    location: string;

    @Field(() => SponsorshipLinks)
    links: SponsorshipLinks;

    @Field(() => SponsorshipImage)
    profile_image: SponsorshipImage;

    @Field()
    instagram_username: string;

    @Field()
    total_collections: number;

    @Field()
    total_likes: number;

    @Field()
    total_photos: number;

    @Field()
    accepted_tos: boolean;
}

@ObjectType()
class Tags {
    @Field()
    title: string;

    @Field()
    source: string;

    @Field()
    prefix: string;

    @Field()
    suffix: string;

    @Field()
    width: number;

    @Field()
    height: number;

    @Field()
    position: number;
}

@ObjectType()
class PhotoUser {
    @Field()
    id: string;

    @Field()
    updated_at: string;

    @Field()
    username: string;

    @Field()
    name: string;

    @Field()
    first_name: string;

    @Field()
    last_name: string;

    @Field()
    twitter_username: string;

    @Field()
    portfolio_url: string;

    @Field()
    bio: string;

    @Field()
    location: string;

    @Field(() => SponsorshipLinks)
    links: {
        self: string;
        html: string;
        photos: string;
        likes: string;
        portfolio: string;
        following: string;
        followers: string;
    };

    @Field(() => SponsorshipImage)
    profile_image: {
        small: string;
        medium: string;
        large: string;
    };

    @Field()
    instagram_username: string;

    @Field()
    total_collections: number;

    @Field()
    total_likes: number;

    @Field()
    total_photos: number;

    @Field()
    accepted_tos: boolean;
}

@ObjectType()
class Urls {
    @Field()
    raw: string;

    @Field()
    full: string;

    @Field()
    regular: string;

    @Field()
    small: string;

    @Field()
    thumb: string;
}

@ObjectType()
export class PhotoObject {
    @Field()
    id: string;

    @Field()
    alt_description: string;

    @Field()
    blur_hash: string;

    @Field(() => [String])
    categories: string[];

    @Field()
    color: string;

    @Field()
    created_at: string;

    @Field(() => [String])
    current_user_collections: string[];

    @Field()
    description: string;

    @Field()
    height: number;

    @Field()
    liked_by_user: boolean;

    @Field()
    likes: string;

    @Field(() => PhotoLinks)
    links: PhotoLinks;

    @Field(() => Location)
    location: Location;

    @Field()
    promoted_at: string;

    @Field(() => Sponsorship, { nullable: true })
    sponsorship: Sponsorship;

    @Field(() => [Tags])
    tags: Tags[];

    @Field()
    updated_at: string;

    @Field(() => PhotoUser)
    user: PhotoUser;

    @Field()
    width: number;

    @Field(() => Urls)
    urls: Urls;
}
