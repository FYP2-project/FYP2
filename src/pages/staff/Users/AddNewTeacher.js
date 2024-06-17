import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../../component/staff/SideBar";
import "../../../css/TopBar.css"; 
import TopBar from "../../../component/staff/TopBar";
import { addNewStaff, addNewStudent, addNewTeacher } from "../../../redux/action";
import "../../../css/AddNewUser.css";
import ConfirmationDialog from "../../../component/student/ConfirmationDialog";
import SuccessMessage from "../../../component/SuccessDialog";

const AddNewTeacher = () => {
  const { addingStaff } = useSelector((state) => state.user); 
  const dispatch = useDispatch();
  const [minimized, setMinimized] = useState(true);
  const [email, setEmail] = useState(""); 
  const [name, setName] = useState("");
  const [scientifictitle, setScientifictitle] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false); 
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); 
  const [addSuccess, setAddSuccess] = useState(false);
  const [addFail, setAddFail] = useState(false);
  
  const toggleMinimized = (isMinimized) => {
    setMinimized(isMinimized);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@uniq\.edu\.iq$/;
    return emailRegex.test(email);
  }

  const validateName = (name) => {
    return name.length >= 2;
  }

  const validatePassword = (password) => {
    return password.length >= 9;
  }

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    setEmailError(validateEmail(e.target.value) ? "" : "Please enter a valid email ending with @uniq.edu.iq");
  }

  const handleChangeName = (e) => {
    setName(e.target.value);
    setNameError(validateName(e.target.value) ? "" : "Name must be at least 2 characters long");
  }

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError(validatePassword(e.target.value) ? "" : "Password must be at least 9 characters or more");
    setPasswordsMatch(e.target.value === confirmPassword);
  }

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(e.target.value === password);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateEmail(email) || !validateName(name) || !validatePassword(password)) {
      return;
    }

    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    try {
      dispatch(addNewTeacher(email, name, scientifictitle, department, password));
      setShowConfirmation(false);
      setShowSuccessMessage(true);
      setEmail("");
      setName("");
      setScientifictitle("");
      setDepartment("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error adding new teacher:", error);
      setShowConfirmation(false);
      setAddFail(true);
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
          <h2>Add New Teacher</h2>
          <form onSubmit={handleAddConfirm}>
            <label>Email:</label>
            <input
              className="AddNewUser"
              type="email"
              value={email}
              onChange={handleChangeEmail}
              required
            />
            {emailError && <p className="ErrorWriting" style={{ color: "red" }}>{emailError}</p>}
            <label>Name:</label>
            <input
              className="AddNewUser"
              type="text"
              value={name}
              onChange={handleChangeName}
              required
            />
            {nameError && <p className="ErrorWriting" style={{ color: "red" }}>{nameError}</p>}
            <label>Scientific Title:</label>
            <input
              className="AddNewUser"
              type="text"
              value={scientifictitle}
              onChange={(e) => setScientifictitle(e.target.value)}
              required
            />
            <label>Department:</label>
            <select
              style={{width:"100%"}}
              id="department"
              name="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            >
              <option value="">Select department</option>
              <option value="SE">SE</option>
              <option value="NT">NT</option>
              <option value="IT">IT</option>
            </select>
            <label>Password:</label>
            <input
              className="AddNewUser"
              type="password"
              value={password}
              onChange={handleChangePassword}
              required
            />
            {passwordError && <p className="ErrorWriting" style={{ color: "red" }}>{passwordError}</p>}
            <label>Confirm Password:</label>
            <input
              className="AddNewUser"
              type="password"
              value={confirmPassword}
              onChange={handleChangeConfirmPassword}
              required
            />
            {!passwordsMatch && <p style={{ color: "red" }}>Passwords do not match</p>}
            <button type="submit" disabled={addingStaff || !passwordsMatch}>
              {addingStaff ? "Adding..." : "Add Teacher"}
            </button>
            {addSuccess && <p style={{ color: "green" }}>Teacher added successfully!</p>}
            {addFail && <p style={{ color: "red" }}>Error adding new teacher</p>}
          </form>
        </div>
      </div>
      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to Add new Teacher?"
          onConfirm={handleSubmit}
          onCancel={cancelAddConfirm}
        />
      )}
      {showSuccessMessage && (
        <SuccessMessage
          message="New teacher Added successfully"
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
    </div>
  );
};

export default AddNewTeacher;
