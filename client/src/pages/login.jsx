import React from "react";
import "../main.css";
import Axios from "axios";
import { useState } from "react";
 

const login = () => {
    const [firstnameReg, setFirstnameReg] = useState("");
    const [lastnameReg, setLastnameReg] = useState("");
    const [emailReg, setEmailReg] = useState("");
    const [usernameReg, setUsernameReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");

    const register = () => {
        Axios.post("http://localhost:8080/register", {
          firstname: firstnameReg,
          lastname: lastnameReg,
          email: emailReg,
          username: usernameReg,
          password: passwordReg,
         }).then((response) => {
            console.log(response);
         });
    };

    return (
        <>
        <div className="App">
        <div className="registration">
           <h1>Registration</h1>

           <label>First Name</label>
           <input type="text" 
           onChange={(e) => {
            setFirstnameReg(e.target.value);
            }}
           /><br/>

           <label>Last Name</label>
           <input type="text" 
           onChange={(e) => {
            setLastnameReg(e.target.value);
            }}
           /><br/>

           <label>Email</label>
           <input type="text" 
           onChange={(e) => {
            setEmailReg(e.target.value);
            }}
           /><br/>

           <label>Username</label>
           <input type="text" 
           onChange={(e) => {
            setUsernameReg(e.target.value);
            }}
           /><br/>

           <label>password</label>
           <input type="text" 
           onChange={(e) =>{
            setPasswordReg(e.target.value);
            }}
           /> <br />

           <button onClick={register} > Register</button>
        </div>
        <div className="login">
           <h1>Login</h1>
           <input type="text" placeholder="Username…" /> <br/>
           <input type="password" placeholder="Password…" />
           <button >Login</button>
        </div>
     </div>
        </>
    )
}

export default login;