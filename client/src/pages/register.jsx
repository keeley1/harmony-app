import React from "react";
import "../main.css";
import Axios from "axios";
import { useState } from "react";
import { Navigate, NavLink } from "react-router-dom";

const Register = () => {
   const [registered, setRegistered] = useState(false);
   const [firstnameReg, setFirstnameReg] = useState("");
   const [lastnameReg, setLastnameReg] = useState("");
   const [emailReg, setEmailReg] = useState("");
   const [usernameReg, setUsernameReg] = useState("");
   const [passwordReg, setPasswordReg] = useState("");
   const [errors, setErrors] = useState([]);
   
   const RegisterUser = () => {
      Axios.post("https://www.doc.gold.ac.uk/usr/201/registeruser", {
         firstname: firstnameReg,
         lastname: lastnameReg,
         email: emailReg,
         username: usernameReg,
         password: passwordReg,
      },{ withCredentials: true })
      .then((response) => {
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
   <div className="form-container">
      <div className="inner-form-container">
         <h1>Register for Harmony</h1>

         <div className="input-container">
            <label className="form-label">First name:</label>
            <input 
            type="text" 
            placeholder="First name" 
            className="input-field"
            onChange={(e) => {setFirstnameReg(e.target.value);}}
            /><br/>
         </div>
         
         <div className="input-container">
            <label className="form-label">last name:</label>
            <input 
            type="text" 
            placeholder="Last name" 
            className="input-field"
            onChange={(e) => {setLastnameReg(e.target.value);}}
            /><br/>
         </div>
            
         <div className="input-container">
            <label className="form-label">Email:</label>
            <input 
            type="text" 
            placeholder="Email" 
            className="input-field"
            onChange={(e) => {setEmailReg(e.target.value);}}
            /><br/>
         </div>
            
         <div className="input-container">
            <label className="form-label">Username:</label>
            <input 
            type="text" 
            placeholder="Username" 
            className="input-field"
            onChange={(e) => {setUsernameReg(e.target.value);}}
            /><br/>
         </div>
            
         <div className="input-container">
            <label className="form-label">Password:</label>
            <input 
            type="text" 
            placeholder="Password" 
            className="input-field"
            onChange={(e) =>{setPasswordReg(e.target.value);}}
            /><br/>
         </div>
            
         <button onClick={RegisterUser} className="form-submit-button">Register</button>

         <p>Already have an account? <NavLink to="/login" className="form-bold-link"><b>Log in</b></NavLink> to Harmony</p>
         {errors.length > 0 && (
         <div className="error-messages">
            <p>{errors[0].msg}</p>
         </div>
         )}

      </div>
   </div>
   </>
   );
};

export default Register;