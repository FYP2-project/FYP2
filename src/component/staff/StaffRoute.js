import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingToRedirect from "../LoadingToRedirect";
import { db } from "../../config/firebase-config";
import { doc, getDoc } from "firebase/firestore";

const StaffRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserInStaffCollection = async () => {
      if (currentUser) {
    
        const userDocRef = doc(db, "staff", currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          setIsStaff(true);
        }
        setIsLoading(false);
      }
    };

    checkUserInStaffCollection();
  }, [currentUser]);

  if (isLoading) {
    return <LoadingToRedirect />; 
  }

 
  if (!isStaff) {
    navigate("/");
    return null;
  }


  return children;
};

export default StaffRoute;
