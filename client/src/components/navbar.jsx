import React from "react";
import { NavLink } from "react-router-dom";
import "../app.css";

const navbar = () => {
    return (
        <nav>
            <ul className="nav-list">
                <div className="nav-container">
                    <div className="nav-title">
                        <li><NavLink to="/" className="nav-item"><b>Harmony</b></NavLink></li>
                    </div>
                    <div className="nav-flex">
                        <li><NavLink to="/about" className="nav-item">About</NavLink></li>
                    </div>
                </div>
            </ul>
        </nav>
    )
}

export default navbar;