import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Axios from "axios";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
    const { loading, loggedIn } = useAuth();

    const handleLogout = () => {
        Axios.get("https://www.doc.gold.ac.uk/usr/201/logout", { withCredentials: true })
            .then(() => {
                // Reload the page upon successful logout
                window.location.reload();
            })
            .catch(error => {
                console.error("Logout failed:", error);
            });
    };

    return (
        <>
            <nav>
                <ul className="nav-list">
                    <div className="nav-container">
                        <div className="nav-title">
                            <li><NavLink to="/" className="nav-item"><b>Harmony</b></NavLink></li>
                        </div>
                        {loggedIn ? (
                            <>
                                <div className="nav-flex">
                                    <li><NavLink to="/goals" className="nav-item">Goals</NavLink></li>
                                </div>
                                <div className="nav-flex">
                                    <li><NavLink className="logout-button" onClick={handleLogout}>Logout</NavLink></li>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="nav-flex">
                                    <li><NavLink to="/about" className="nav-item">About</NavLink></li>
                                </div>
                                <div className="nav-flex">
                                    <li><NavLink to="/login" className="nav-item" id="nav-item-login">Log in</NavLink></li>
                                </div>
                            </>
                        )}
                    </div>
                </ul>
            </nav>
        </>
    );
};

export default Navbar;
