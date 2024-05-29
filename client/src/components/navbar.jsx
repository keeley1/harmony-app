import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
    const navigate = useNavigate();
    const { loading, loggedIn } = useAuth();

    const handleLogout = () => {
        Axios.get("http://localhost:8000/logout", { withCredentials: true })
        .then(() => {
            // reload page upon successful logout
            navigate("/");
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
                    <div className="nav-inner-1">
                        <div className="nav-title">
                            <li><NavLink to="/" className="nav-item"><b>Harmony</b></NavLink></li>
                        </div>
                        
                        {loggedIn ? (
                        <div className="nav-flex">
                            <li><NavLink to="/goals" className="nav-item">Goals</NavLink></li>
                        </div>
                        ) : (
                        <div className="nav-flex">
                            <li><NavLink to="/about" className="nav-item">About</NavLink></li>
                        </div>
                        )}

                        {loggedIn ? (
                        <div className="nav-flex">
                            <li><NavLink to="/projects" className="nav-item">Projects</NavLink></li>
                        </div>
                        ) : (
                        <div className="nav-flex"></div>
                        )}
                    </div>
                    
                    {loggedIn ? (
                    <>
                    <div className="nav-inner-2">
                        <div className="nav-flex">
                            <li><NavLink to="/settings" className="nav-item">Settings</NavLink></li>
                        </div>
                        <div className="nav-flex">
                            <li><NavLink className="logout-button" onClick={handleLogout}>Log out</NavLink></li>
                        </div>
                    </div>
                    </>
                    ) : (
                    <>
                    <div className="nav-inner-2">
                        <div className="nav-flex">
                            <li><NavLink to="/login" className="nav-item" id="nav-item-login">Log in</NavLink></li>
                        </div>
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
