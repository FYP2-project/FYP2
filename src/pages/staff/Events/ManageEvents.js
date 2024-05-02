import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../../component/staff/SideBar";
import "../../../css/TopBar.css"; 
import "../../../App.css"
import TopBar from "../../../component/staff/TopBar";
import { useNavigate } from "react-router-dom";

const ManageEvents = () => {
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
      <div className="rectangle red" onClick={()=>{navigate("/Events/ManageEvents/ManageSeminar")}}>
      <div className="color-box"></div>
    <div className="text">Manage Seminar</div></div>
      <div className="rectangle GoldenRod" onClick={()=>{navigate("/Events/ManageEvents/ManagePresentation")}}>
      <div className="color-box"></div>
    <div className="text">Manage Presentation</div></div>
      <div className="rectangle DodgerBlue" onClick={()=>{navigate("/Events/ManageEvents/ManageWorkShop")}}>
      <div className="color-box"></div>
    <div className="text">Manage Workshop</div></div>
      <div className="rectangle blue" onClick={()=>{navigate("/Events/ManageEvents/ManageOtherEvent")}}>
      <div className="color-box"></div>
    <div className="text">Manage Other Events</div></div>
      
      
    </div>


      </div>

      </div>
     
    

    </div>
  );
};

export default ManageEvents;
