import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../../component/staff/SideBar";
import "../../../css/TopBar.css"; 
import "../../../App.css"
import TopBar from "../../../component/staff/TopBar";
import { useNavigate } from "react-router-dom";

const AttendanceType = () => {
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
      <div >
     
      <div className={`content${minimized ? 'minimized' : ''}`}>
      <div className="container">
  <div className="rectangle olive" onClick={() => { navigate("/Events/AttendanceType/Student") }}>
    <div className="color-box"></div>
    <div className="text">Student Attendance </div>
  </div>
  <div className="rectangle blue" onClick={() => { navigate("/Events/AttendanceType/Lecturer") }}>
    <div className="color-box"></div>
    <div className="text">Lecturer Attendance</div>
  </div>
</div>

      </div>

      </div>
     
    

    </div>
  );
};

export default AttendanceType;
