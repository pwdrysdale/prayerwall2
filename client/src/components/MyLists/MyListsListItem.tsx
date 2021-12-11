import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { List, Photo, Prayer } from "../../types";
import Button from "../HTML/Button";

interface ListItemProps {
    list: List;
}

const MyListsListItem: FC<ListItemProps> = ({ list }) => {
    const [photo, setPhoto] = useState<null | Photo>();

    useEffect(() => {
        if (list.photo) {
            setPhoto(JSON.parse(list.photo));
        }
    }, [list]);

    return (
        <div key={list.id}>
            <Link to={`/lists/${list.id}`}>
                <h1>{list.name}</h1>
            </Link>
            <Link to={`/lists/edit/${list.id}`}>
                <Button title="Edit" />
            </Link>
            {photo?.id && <img src={photo?.urls?.regular} alt="" />}
            <div>{list.description}</div>
            <div>{list.length}</div>
            <div>{list.privat ? "Private" : "Public"}</div>

            {!list.prayers.length ? (
                <div>This list is empty </div>
            ) : (
                <div>
                    <h2>Prayers</h2>
                    {list.prayers.map((P: Prayer) => {
                        return (
                            <div key={P.id}>
                                {P.title}
                                {P.body}
                                {P.user.username}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyListsListItem;
