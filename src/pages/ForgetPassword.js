import React, { useState } from "react";
import { UseDispatch, useDispatch, useSelector} from "react-redux";
import { logoutInitiate, sendResetPasswordEmail } from "../redux/action";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase-config";
const ForgetPassword = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        setEmail(e.target.value);

        setError(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage("Please enter a valid email address.");
            setError(true); 
            return;
        }
        if (!email.endsWith('@uniq.edu.iq')) {
            setMessage("Please enter a valid UNIQ email address ending with @uniq.edu.iq.");
            setError(true); 
            return;
        }
        try {
            dispatch(sendResetPasswordEmail(email));
            setMessage("Password reset email sent. Please check your email.");
            setError(false);
        } catch (error) {
            setMessage("Error sending password reset email. Please try again.");
            setError(true); 
            console.error("Error sending password reset email:", error);
        }
    };

    
    return (
        <div className="login-container">
        <div id="login-form">
            <h2>Forget Password</h2>
          
            <form className="form-signin"  onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input type="email" value={email} onChange={handleChange} required/>
                </label>
                <button type="submit">Reset Password</button>
            </form>
            {message && <p className={error ? "error" : ""}>{message}</p>}
            <div className="forgot-password">
        <a style={{marginLeft:"5%"}} href="/">Go Back</a>
      </div>
        </div>
        </div>
    );
};

export default ForgetPassword;
