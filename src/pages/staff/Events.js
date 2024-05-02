import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../component/staff/SideBar";
import "../../css/TopBar.css"; 
import "../../App.css"
import TopBar from "../../component/staff/TopBar";
import { useNavigate } from "react-router-dom";

const Events = () => {
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
  <div className="rectangle orange" onClick={() => { navigate("/Events/AddNewEvents") }}>
    <div className="color-box"></div>
    <div className="text">Add New Event</div>
  </div>
  <div className="rectangle purple" onClick={() => { navigate("/Events/ManageEvents") }}>
    <div className="color-box"></div>
    <div className="text">Manage Events</div>
  </div>
  <div className="rectangle blue" onClick={() => { navigate("/Events/AttendanceType") }}>
    <div className="color-box"></div>
    <div className="text">Attendance type</div>
  </div>
</div>

      </div>

      </div>
     
    

    </div>
  );
};

export default Events;
