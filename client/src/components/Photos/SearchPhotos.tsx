import axios from "axios";
import React, { FormEvent, FormEventHandler, useEffect } from "react";
import { Photo } from "../../types";

interface PhotoSearchProps {
    selectedPhoto: Partial<Photo>;
    setSelectedPhoto: (photo: Photo) => void;
}

const SearchPhotos: React.FC<PhotoSearchProps> = ({
    selectedPhoto,
    setSelectedPhoto,
}: PhotoSearchProps) => {
    const [apikey, setApiKey] = React.useState("");
    const [page, setPage] = React.useState(1);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [photos, setPhotos] = React.useState<Photo[]>([]);
    const [loading, setLoading] = React.useState(true);

    const getApiKey = React.useCallback(async () => {
        const { data } = await axios.get(
            "http://localhost:4000/unsplash/apikey"
        );
        setApiKey(data.key);
        return;
    }, []);

    const getPhotos = React.useCallback(
        async (term?: string) => {
            setLoading(true);
            console.log(term);
            if (searchTerm === "" || term === "") {
                const { data } = await axios.get(
                    `https://api.unsplash.com/photos/?client_id=${apikey}&page=${page}`
                );
                setPhotos(data);
            } else {
                console.log(term);
                const { data } = await axios.get(
                    `https://api.unsplash.com/search/photos?client_id=${apikey}&page=${page}&query=${
                        term ?? searchTerm
                    }`
                );
                console.log(data);
                setPhotos(data.results);
            }
            setLoading(false);
        },
        [apikey, page, searchTerm]
    );

    useEffect(() => {
        if (apikey === "") {
            getApiKey();
        } else {
            getPhotos();
        }
        return;
    }, [apikey, page]);

    return (
        <div>
            <h1>Select A Photo</h1>
            <label htmlFor="search">Search</label>
            <input
                id="search"
                type="text"
                onChange={(e) => {
                    setSearchTerm(() => e.target.value);
                    getPhotos(e.target.value);
                }}
                value={searchTerm}
            />
            {loading ? (
                <div>Loading...</div>
            ) : photos.length === 0 ? (
                <h1>No Photos Found</h1>
            ) : (
                photos.map((p) => (
                    <div
                        onClick={() => {
                            setSelectedPhoto(p);
                        }}
                        key={p.id}
                    >
                        {p.id === selectedPhoto.id && (
                            <p>This one is selected</p>
                        )}
                        <img src={p.urls.small} alt={p.alt_description} />
                        <p>
                            {p.user.first_name + " " + (p.user.last_name || "")}{" "}
                            on <a href={p.links.self}>Unsplash</a>
                        </p>
                    </div>
                ))
            )}

            <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
    );
};

export default SearchPhotos;
