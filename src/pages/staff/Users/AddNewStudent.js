import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../../component/staff/SideBar";
import "../../../css/TopBar.css"; 
import TopBar from "../../../component/staff/TopBar";
import { addNewStaff, addNewStudent } from "../../../redux/action";
import "../../../css/AddNewUser.css";
import ConfirmationDialog from "../../../component/student/ConfirmationDialog";
import SuccessMessage from "../../../component/SuccessDialog";

const AddNewStudent = () => {
  const { currentUser, addingStaff } = useSelector((state) => state.user); // Include addingStaff from state
  const dispatch = useDispatch();
  const [minimized, setMinimized] = useState(true);
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password input
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false); 
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); 
  const toggleMinimized = (isMinimized) => {
    setMinimized(isMinimized);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch the addStaff action with email and password
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
     // Email validation
  const emailRegex = /^[\w-]+(\.[\w-]+)*@uniq\.edu\.iq$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email ending with @uniq.edu.iq");
    return;
  }

  // Name validation
  if (name.length < 2) {
    alert("Name must be at least 2 characters long");
    return;
  }

  // Password validation
  if (password.length < 9) {
    alert("Password must be at least 9 characters or more");
    return;
  }
    dispatch(addNewStudent(email, name, password));
    setShowConfirmation(false);
    setShowSuccessMessage(true)
    setEmail("");
    setName("");
    setPassword("");
    setConfirmPassword("");
  };
  const handleAddConfirm = (e) => {
    e.preventDefault();
    setShowConfirmation(true); // Show confirmation dialog
  };

  const cancelAddConfirm = () => {
    setShowConfirmation(false); // Hide confirmation dialog if user cancels
  };


  return (
    <div className="App">
      <TopBar />
      <SideBar onToggleMinimized={toggleMinimized} />
      <div>
        <div className={`content${minimized ? "minimized" : ""}`}>
          <h2>Add New Student</h2>
          <form onSubmit={handleAddConfirm}>
            <label>Email:</label>
            <input
            className="AddNewUser"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
             <label>Name:</label>
            <input
            className="AddNewUser"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label>Password:</label>
            <input
            className="AddNewUser"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
              <label>Confirm Password:</label>
            <input
            className="AddNewUser"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordsMatch(e.target.value === password);
              }}
              required
            />
            {!passwordsMatch && <p style={{color:"red"}}>Passwords do not match</p>}
            <button type="submit" disabled={addingStaff || !passwordsMatch}>
              {addingStaff ? "Adding..." : "Add Student"}
            </button>
          </form>
        </div>
      </div>
      {showConfirmation && (
            <ConfirmationDialog
              message="Are you sure you want to Add new Student?"
              onConfirm={handleSubmit}
              onCancel={cancelAddConfirm}
            />
          )}
          {showSuccessMessage && (
        <SuccessMessage
          message="New student Added successfully"
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
    </div>
  );
};

export default AddNewStudent;
