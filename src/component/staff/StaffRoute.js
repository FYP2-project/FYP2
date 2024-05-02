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
        // Check if the user's document exists in the staff collection
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
    return <LoadingToRedirect />; // Render loading component while isLoading is true
  }

  // Redirect the user to the notFound page if not in the staff collection
  if (!isStaff) {
    navigate("/");
    return null;
  }

  // Render the children if the user is in the staff collection
  return children;
};

export default StaffRoute;
