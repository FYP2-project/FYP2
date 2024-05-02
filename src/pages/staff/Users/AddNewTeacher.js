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
  const { currentUser, addingStaff } = useSelector((state) => state.user); // Include addingStaff from state
  const dispatch = useDispatch();
  const [minimized, setMinimized] = useState(true);
  const [email, setEmail] = useState(""); // State for email input
  const [name, setName] = useState("");
  const [scientifictitle, setScientifictitle] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState(""); // State for password input
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password input
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false); 
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); 
  const [addSuccess, setAddSuccess] = useState(false);
  const [addFail, setAddFail] = useState(false);
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
    setShowConfirmation(true); // Show confirmation dialog
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
              onChange={(e) => setEmail(e.target.value)}
              required
            /><label>Name:</label>
            <input
            className="AddNewUser"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
