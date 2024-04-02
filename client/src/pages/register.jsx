import React from "react";
import "../main.css";
import Axios from "axios";
import { useState } from "react";
import { Navigate } from "react-router-dom";

const Register = () => {
   const [registered, setRegistered] = useState(false);
   const [firstnameReg, setFirstnameReg] = useState("");
   const [lastnameReg, setLastnameReg] = useState("");
   const [emailReg, setEmailReg] = useState("");
   const [usernameReg, setUsernameReg] = useState("");
   const [passwordReg, setPasswordReg] = useState("");
   const [errors, setErrors] = useState([]);
   
   const RegisterUser = () => {
      Axios.post("http://localhost:8080/register", {
         firstname: firstnameReg,
         lastname: lastnameReg,
         email: emailReg,
         username: usernameReg,
         password: passwordReg,
      }).then((response) => {
         console.log(response);
         setRegistered(true);
      }).catch((error) => {
         if (error.response && error.response.data.errors) {
           setErrors(error.response.data.errors);
         } else {
           console.error("Error registering user:", error);
         }
       });
   };
   
   return (
   <>
   {registered && <Navigate to="/login" replace />}
   <div className="App">
      <div className="registration">
         <h1>Register for Harmony</h1>
         
         <label>First Name</label>
         <input type="text" 
         onChange={(e) => {setFirstnameReg(e.target.value);}}
         /><br/>
            
         <label>Last Name</label>
         <input type="text" 
         onChange={(e) => {setLastnameReg(e.target.value);}}
         /><br/>
            
         <label>Email</label>
         <input type="text" 
         onChange={(e) => {setEmailReg(e.target.value);}}
         /><br/>
            
         <label>Username</label>
         <input type="text" 
         onChange={(e) => {setUsernameReg(e.target.value);}}
         /><br/>
            
         <label>password</label>
         <input type="text" 
         onChange={(e) =>{setPasswordReg(e.target.value);}}
         /><br/>
            
         <button onClick={RegisterUser}>Register</button>

         {errors.length > 0 && (
            <div className="error-messages">
              {errors.map((error, index) => (
                <p key={index}>{error.msg}</p>
              ))}
            </div>
          )}

         <p></p>
      </div>
   </div>
   </>
   );
};

export default Register;