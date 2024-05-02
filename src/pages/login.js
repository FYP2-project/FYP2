import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginInitiate } from "../redux/action";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import "../css/login.css";
import logo from "../images/qiu.png";
import video from "../images/qiu.mp4";
const Login = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const { error } = useSelector((state) => state.user);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const checkUserInStaffCollection = async () => {
    const userDocRef = doc(db, "staff", currentUser.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    
    return userDocSnapshot.exists()

}

const checkUserInTeacherCollection = async () => {
  const userDocRef = doc(db, "teacher", currentUser.uid);
  const userDocSnapshot = await getDoc(userDocRef);
  return userDocSnapshot.exists()


}
const checkUserInStudentCollection = async () => {
  const userDocRef = doc(db, "student", currentUser.uid);
  const userDocSnapshot = await getDoc(userDocRef);
  return userDocSnapshot.exists()


}
useEffect(() => {
  const fetchUserCollections = async () => {
      if (currentUser) {
          if (await checkUserInStaffCollection()) {
              navigate("/Events");
          } else if (await checkUserInTeacherCollection()) {
              navigate("/LecturerEvent");
          }
          else if (await checkUserInStudentCollection()) {
            navigate("/Student/Events");
        } else {
              navigate("/");
          }
      }
  };

  fetchUserCollections();
}, [currentUser, navigate]);

  const dispatch = useDispatch();

  const { email, password } = state;
  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = state;
    if (!email || !password) {
        return;
    }
    dispatch(loginInitiate(email, password));
    setState({ email: "", password: "" });
};

  const handleChange = (e) => {
    let { name, value } = e.target;
    setState({ ...state, [name]: value });
    dispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <div className="login-container">
  <div id="login-form">
    <form className="form-signin" onSubmit={handleSubmit}>
    <img src={logo} alt="Qiu Logo" className="logo" />
    <video src={video} className="video" autoPlay loop muted></video>
    <input
    type="email"
    id="inputEmail"
    name="email"
    className={error ? "error-input" : ""}
    placeholder="Email Address"
    onChange={handleChange}
    value={email}
    required
/>
<input
    type="password"
    id="inputPassword"
    name="password"
    className={error ? "error-input" : ""}
    placeholder="Password"
    onChange={handleChange}
    value={password}
    required
/>
      <button type="submit">Login</button>
      <div className="forgot-password">
        <a href="/ForgetPassword">Forgot Password?</a>
      </div>
    </form>
    {error && <div key={error} className="error-message" >{"Incorrect Email or Password"}</div>}
  </div>
</div>
  );
};

export default Login;
