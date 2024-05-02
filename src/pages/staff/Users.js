import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutInitiate } from "../../redux/action";
import SideBar from "../../component/staff/SideBar";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import TopBar from "../../component/staff/TopBar";
import { Navigate, useNavigate } from "react-router-dom";

const Users = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [minimized, setMinimized] = useState(true);
  const navigate = useNavigate();

  const toggleMinimized = (isMinimized) => {
    setMinimized(isMinimized);
  };

  return (
    <div className="App">
      <TopBar />
      <SideBar onToggleMinimized={toggleMinimized} />
      <div className={`content${minimized ? 'minimized' : ''}`}>
      <div className="container">
      <div className="rectangle red" onClick={()=>{navigate("/Users/AddNewStaff")}}>
      <div className="color-box"></div>
    <div className="text">Add New Staff</div> </div>
      <div className="rectangle green" onClick={()=>{navigate("/Users/AddNewStudent")}}>
      <div className="color-box"></div>
    <div className="text">Add New Student</div></div>
      <div className="rectangle GoldenRod" onClick={()=>{navigate("/Users/AddNewTeacher")}}>
      <div className="color-box"></div>
    <div className="text">Add New Teacher</div></div>
      
    </div>

      </div>
    </div>
  );
};
export default Users;
