import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../component/staff/SideBar";
import "../../css/TopBar.css"; 
import "../../App.css"
import TopBar from "../../component/staff/TopBar";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../config/firebase-config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import ConfirmationDialog from "../../component/student/ConfirmationDialog";
import { updateStaffProfile } from "../../redux/action";
import SuccessMessage from "../../component/SuccessDialog";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [minimized, setMinimized] = useState(true);
  const [userData, setUserData] = useState(null); // Initialize userData as null
  const [imageFile, setImageFile] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [perc, setPerc] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Initialize isLoading as true
  const [isUpdating, setIsUpdating] = useState(false); // Initialize isUpdating as false
  const [showConfirmation, setShowConfirmation] = useState(false); 
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);  
  const toggleMinimized = (isMinimized) => {
    setMinimized(isMinimized);
  };

  useEffect(() => {
    // Fetch user data from Firestore
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "staff", currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserData(userData);
          setIsLoading(false); // Set isLoading to false after data is fetched
        } else {
          console.error("User data not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [currentUser.uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file type
      const fileType = selectedFile.type;
      if (
        fileType === "image/jpeg" ||
        fileType === "image/png" ||
        fileType === "image/gif"
      ) {
        setImageFile(selectedFile);
        uploadFile(selectedFile); // Upload file
      } else {
        alert("Only JPG, PNG, and GIF file types are allowed.");
      }
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true); // Show confirmation dialog
  };

  const cancelAddSubmit = () => {
    setShowConfirmation(false); // Hide confirmation dialog if user cancels
  };

  const uploadFile = (file) => {
    const name = new Date().getTime() + file.name;
    const storageRef = ref(storage, "ProfileImages/" + name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setIsUploadingImage(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setPerc(progress);
      },
      (error) => {
        console.error("Error uploading file:", error);
        setIsUploadingImage(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUserData((prevUserData) => ({
            ...prevUserData,
            image: downloadURL,
          }));
          setIsImageUploaded(true);
          setIsUploadingImage(false);
        });
      }
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent form submission
    setIsUpdating(true); // Set isUpdating to true when update button is clicked
    try {
      dispatch(updateStaffProfile(currentUser.uid, userData));
      console.log("User data updated successfully");
       setShowConfirmation(false);
       setShowSuccessMessage(true);
    } catch (error) {
      console.error("Error updating user data:", error);
      setShowConfirmation(false);
    }
   
    // Set a timeout to reset isUpdating after 1.5 seconds
    setTimeout(() => {
      setIsUpdating(false);
    }, 1500);
  };

  return (
    <div className="App">
      <TopBar />
      <SideBar onToggleMinimized={toggleMinimized} />
      <div>
        <div className={`content${minimized ? 'minimized' : ''}`}>
          {isLoading ? ( // Conditional rendering of loading message
             <div className="spinner-container">
             <div className="spinner"></div>
           </div>
          ) : (
            <form onSubmit={handleAddSubmit}>
              <h2>Edit Profile</h2>
              {userData.image && <img className="ProfileImage" src={userData.image} alt="User" />}
              <label>Name:</label>
              <input
              className="AddNewUser"
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
              />
              <label>Image:</label>
              <input
              className="AddNewUser"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <button type="submit" disabled={isUploadingImage || isUpdating}>
                {isUpdating ? 'Updating...' : 'Update Profile'}
              </button>
              {perc !== 0 && <p>Upload Progress: {perc}%</p>}
            </form>
          )}
        </div>
      </div>
      {showConfirmation && (
            <ConfirmationDialog
              message="Are you sure you want update your profile?"
              onConfirm={handleUpdate}
              onCancel={cancelAddSubmit}
            />
          )}
               {showSuccessMessage && (
        <SuccessMessage
          message="Updated successfully"
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
    </div>
  );
};
export default Profile;
