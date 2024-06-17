import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../../component/staff/SideBar";
import "../../../css/TopBar.css"; 
import TopBar from "../../../component/staff/TopBar";
import { addNewStaff } from "../../../redux/action";
import "../../../css/AddNewUser.css";
import ConfirmationDialog from "../../../component/student/ConfirmationDialog";
import SuccessMessage from "../../../component/SuccessDialog";

const AddNewStaff = () => {
  const { currentUser, addingStaff } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [minimized, setMinimized] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const toggleMinimized = (isMinimized) => {
    setMinimized(isMinimized);
  };

  const validateEmail = (value) => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@uniq\.edu\.iq$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email ending with @uniq.edu.iq");
    } else {
      setEmailError("");
    }
  };

  const validateName = (value) => {
    if (value.length < 2) {
      setNameError("Name must be at least 2 characters long");
    } else {
      setNameError("");
    }
  };

  const validatePassword = (value) => {
    if (value.length < 9) {
      setPasswordError("Password must be at least 9 characters or more");
    } else {
      setPasswordError("");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    validateEmail(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    validateName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    validatePassword(e.target.value);
    setPasswordsMatch(e.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(e.target.value === password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    validateEmail(email);
    validateName(name);
    validatePassword(password);

    if (!emailError && !nameError && !passwordError) {
      dispatch(addNewStaff(email, name, password));
      setShowConfirmation(false);
      setShowSuccessMessage(true);
      setEmail("");
      setName("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  const handleAddConfirm = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const cancelAddConfirm = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="App">
      <TopBar />
      <SideBar onToggleMinimized={toggleMinimized} />
      <div>
        <div className={`content${minimized ? "minimized" : ""}`}>
          <h2>Add New Staff</h2>
          <form onSubmit={handleAddConfirm}>
            <label>Email:</label>
            <input
              className="AddNewUser"
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
            {emailError && <p className="ErrorWriting" style={{ color: "red" }}>{emailError}</p>}
            <label>Name:</label>
            <input
              className="AddNewUser"
              type="text"
              value={name}
              onChange={handleNameChange}
              required
            />
            {nameError && <p className="ErrorWriting" style={{ color: "red" }}>{nameError}</p>}
            <label>Password:</label>
            <input
              className="AddNewUser"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            {passwordError && <p className="ErrorWriting" style={{ color: "red" }}>{passwordError}</p>}
            <label>Confirm Password:</label>
            <input
              className="AddNewUser"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            {!passwordsMatch && (
              <p style={{ color: "red" }}>Passwords do not match</p>
            )}
            <button type="submit" disabled={addingStaff || !passwordsMatch}>
              {addingStaff ? "Adding..." : "Add Staff"}
            </button>
          </form>
        </div>
      </div>
      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to Add new Staff?"
          onConfirm={handleSubmit}
          onCancel={cancelAddConfirm}
        />
      )}

      {showSuccessMessage && (
        <SuccessMessage
          message="New staff Added successfully"
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
    </div>
  );
};
export default AddNewStaff;
