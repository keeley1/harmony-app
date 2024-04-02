import React from "react";
import "../main.css";
import Axios from "axios";
import { useState } from "react";
import { Navigate } from "react-router-dom";
 

const Login = () => {
    const [loginStatus, setLoginStatus] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState ("");

    const LoginUser = () => {
        Axios.post("http://localhost:8080/login", {
            username: username,
            password: password,
        }).then((response) => {
            if (response.data.message) { 
                // If there is a message in the response, it means an error occurred
                setLoginStatus(response.data.message);
            } else {
                setLoginStatus('Login Successful');
                // Possibly redirect the user to another page or set authentication state
            }
        }).catch((error) => {
            console.error("Login failed:", error);
            // Handle the error, maybe set a loginStatus to display the error
        });
    };

    return (
    <>
    {loginStatus === 'Login Successful' && <Navigate to="/" replace />}
    <div className="App">
        <div className="login">
            <h1>Login</h1>
            
            <input type="text" placeholder="Username…" 
            onChange = { (e) => {setUsername (e.target.value);}}
            /><br/>
                
            <input type="password" placeholder="Password…" 
            onChange = { (e) => {setPassword (e.target.value);}}
            /><br/>
                
            <button onClick={LoginUser}>Login</button>
        </div>
        <p>{loginStatus}</p>
    </div>
    </>
    );
};

export default Login;