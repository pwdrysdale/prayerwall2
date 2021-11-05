import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div>
            <ul>
                <Link to="/login">
                    <li>Login</li>
                </Link>
                <Link to="/prayer/add">
                    <li>Add Prayer</li>
                </Link>
                <Link to="/prayer/my">
                    <li>My Prayers</li>
                </Link>
                <Link to="/prayer/public">
                    <li>Public Prayers</li>
                </Link>
                <Link to="/user/following">
                    <li>Following</li>
                </Link>
                <Link to="/prayer/following">
                    <li>Following Prayers</li>
                </Link>
                <Link to="/lists/my">
                    <li>My Lists</li>
                </Link>
                <Link to="/lists/add">
                    <li>Add A List</li>
                </Link>
                <Link to="/give">
                    <li>Give</li>
                </Link>
            </ul>
        </div>
    );
};

export default Navbar;
