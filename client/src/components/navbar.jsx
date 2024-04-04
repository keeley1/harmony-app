import React from "react";
import { NavLink } from "react-router-dom";
import "../app.css";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
    const { loading, loggedIn } = useAuth();
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
                        <li><button>Logout</button></li>
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