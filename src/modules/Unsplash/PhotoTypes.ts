export type Photo = {
    id: string;
    alt_description: string;
    blur_hash: string;
    categories: string[];
    color: string;
    created_at: string;
    current_user_collections: string[];
    description: string;
    height: number;
    liked_by_user: boolean;
    likes: number;
    links: {
        download: string;
        download_location: string;
        html: string;
        self: string;
    };
    location: {
        city: string;
        country: string;
        position: {
            latitude: number;
            longitude: number;
        };
    };
    promoted_at: string;
    sponsorship: {
        impression_urls: string[];
        tagline: string;
        tagline_url: string;
        sponsor: {
            id: string;
            updated_at: string;
            username: string;
            name: string;
            first_name: string;
            last_name: string;
            twitter_username: string;
            portfolio_url: string;
            bio: string;
            location: string;
            links: {
                self: string;
                html: string;
                photos: string;
                likes: string;
                portfolio: string;
                following: string;
                followers: string;
            };
            profile_image: {
                small: string;
                medium: string;
                large: string;
            };
            instagram_username: string;
            total_collections: number;
            total_likes: number;
            total_photos: number;
            accepted_tos: boolean;
        };
    };
    tags: {
        title: string;
        source: string;
        prefix: string;
        suffix: string;
        width: number;
        height: number;
        position: number;
    }[];
    updated_at: string;
    user: {
        id: string;
        updated_at: string;
        username: string;
        name: string;
        first_name: string;
        last_name: string;
        twitter_username: string;
        portfolio_url: string;

        bio: string;
        location: string;
        links: {
            self: string;
            html: string;
            photos: string;
            likes: string;
            portfolio: string;
            following: string;
            followers: string;
        };
        profile_image: {
            small: string;
            medium: string;
            large: string;
        };
        instagram_username: string;
        total_collections: number;
        total_likes: number;
        total_photos: number;
        accepted_tos: boolean;
    };
    width: number;
    urls: {
        raw: string;
        full: string;
        regular: string;
        small: string;
        thumb: string;
    };
};
