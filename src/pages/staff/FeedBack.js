import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../component/staff/SideBar";
import "../../css/TopBar.css"; 
import "../../App.css"
import TopBar from "../../component/staff/TopBar";
import { useNavigate } from "react-router-dom";

const FeedBack = () => {
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
    <div className="rectangle olive" onClick={()=>{navigate("/FeedBack/AddFeedback")}}>
    <div className="color-box"></div>
    <div className="text">Add New Feedback</div></div>
    <div className="rectangle DodgerBlue" onClick={()=>{navigate("/FeedBack/ManageFeedBack")}}>
    <div className="color-box"></div>
    <div className="text">Manage Feedback</div></div>
    <div className="rectangle light-green" onClick={()=>{navigate("/FeedBack/FeedbackAnswerList")}}>
    <div className="color-box"></div>
    <div className="text">Feedback Answer List</div></div>
    
</div>

    </div>

    </div>
   
  

  </div>
  );
};

export default FeedBack;
