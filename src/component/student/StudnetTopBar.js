import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutInitiate } from "../../redux/action";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import "../../css/TopBar.css";
import { StudnetSideBarData } from "./StudnetSideBarData";
import { Navigate, useNavigate } from "react-router-dom";
import logo from "../../images/qiu.png";
const StudentTopBar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userImage, setUserImage] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [pageTitle, setPageTitle] = useState("");
  const navigate = useNavigate();


  const handleAuth = () => {
    if (currentUser) {
      dispatch(logoutInitiate());
      window.location.reload();
    }
  };

  const handleProfile = ()=>{
    navigate("/StudentProfile")
  }

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const userDocRef = doc(db, "student", currentUser.uid); 
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserImage(userData.image);
        }
      } catch (error) {
        console.error("Error fetching user image:", error);
      }
    };

    if (currentUser) {
      fetchUserImage();
    }
  }, [currentUser]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  useEffect(() => {

    const currentPage = StudnetSideBarData.find(item => item.link === window.location.pathname);
    setPageTitle(currentPage ? currentPage.title : "");
  }, [window.location.pathname]);

  return (
    <div className="TopBar">
      <div className="TopBarEmail">
      <img className="Top-Bar-Logo" onClick={()=> navigate("/Student/Events")}  src={logo} />
      </div>
      <h5 className="User-email">{currentUser && currentUser.email}</h5>
      <div className="dropdown">
        <img
          src={userImage}
          alt="User"
          className="userImage"
          onClick={toggleDropdown}
        />
        {isDropdownOpen && (
          <div className="dropdown-content">
               <button className="logoutButton" onClick={handleProfile}>
              Profile
            </button>
            <button className="logoutButton" onClick={handleAuth}>
              Logout
            </button>
        
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTopBar;
