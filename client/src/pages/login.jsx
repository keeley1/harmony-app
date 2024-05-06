import React, { useState } from 'react';
import '../app.css';
import Axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [loginStatus, setLoginStatus] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState ('');

    const LoginUser = () => {
        Axios.post("http://localhost:8000/loginuser", {
            username: username,
            password: password,
        }, { withCredentials: true })
        .then((response) => {
            if (response.data.message) { 
                setLoginStatus(response.data.message);
            } else {
                setLoginStatus('Login Successful');
                // redirect the user to the home page
                navigate("/");
            }
        })
        .catch((error) => {
            console.error("Login failed:", error);
        });
    };

    return (
    <>
    <div className="form-container">
        <div className="inner-form-container">
            <h1 className="login-title">Welcome to Harmony</h1>
            
            <div className="input-container">
                <label className="form-label">Username:</label>
                <input 
                type="text" 
                placeholder="Username" 
                className="input-field"
                onChange={(e) => { setUsername(e.target.value);}}
                /><br/>
            </div>

            <div className="input-container">
                <label className="form-label">Password:</label>    
                <input 
                type="password" 
                placeholder="Password" 
                className="input-field"
                onChange = { (e) => {setPassword (e.target.value);}}
                /><br/>
            </div>
                
            <button onClick={LoginUser} className="form-submit-button">Login</button>
            <p>Don't have an account? <NavLink to="/register" className="form-bold-link"><b>Register</b></NavLink> for Harmony</p>
        </div>
        <p>{loginStatus}</p>
    </div>
    </>
    );
};

export default Login;
