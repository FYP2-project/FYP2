import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "../../css/TopBar.css";
import "../../App.css"
import LTopBar from "../../component/teacher/LecturerTopBar";
import LSideBar from "../../component/teacher/LecturerSideBar";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db, storage } from "../../config/firebase-config";
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { GrCertificate } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import DeleteDialog from "../../component/DeleteDialog";
import ConfirmationDialog from "../../component/student/ConfirmationDialog";
import SuccessMessage from "../../component/SuccessDialog";

const Portfolio = () => {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [minimized, setMinimized] = useState(true);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [presentingEvents, setPresentingEvents] = useState(0);
    const [attendingEvents, setAttendingEvents] = useState(0);
    const [presentingEventNames, setPresentingEventNames] = useState([]);
    const [attendingEventNames, setAttendingEventNames] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [briefing, setBriefing] = useState("");
    const [briefingError, setBriefingError] = useState("");
    const [showBriefingPopup, setShowBriefingPopup] = useState(false);
    const [showCertPopup, setShowCertPopup] = useState(false);
    const [certFile, setCertFile] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showCertificateConfirmation, setShowCertificateConfirmation] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [showDeleteMessage, setShowDeleteMessage] = useState(false);
    const [showSuccessDeleteMessage, setShowSuccessDeleteMessage] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);  
    const [uploading, setUploading] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDocRef = doc(db, "teacher", currentUser.uid);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    setUserData(userData);
                    setIsLoading(false);
                    if (userData.briefing) {
                        setBriefing(userData.briefing); 
                    }
                } else {
                    setError("User data not found");
                }
            } catch (error) {
                setError("Error fetching user data");
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();

        const fetchPresentingEvents = async () => {
            try {
                const eventsQuery = query(collection(db, "Events"), where("presenting", "array-contains", currentUser.uid));
                const eventsSnapshot = await getDocs(eventsQuery);
                setPresentingEvents(eventsSnapshot.size);

                const presentingNames = eventsSnapshot.docs.map(doc => doc.data().title);
                setPresentingEventNames(presentingNames);
            } catch (error) {
                console.error("Error fetching presenting events:", error);
            }
        };
        fetchPresentingEvents();

        const fetchAttendingEvents = async () => {
            try {
                const eventsQuery = query(collection(db, "Events"), where("attending", "array-contains", currentUser.uid));
                const eventsSnapshot = await getDocs(eventsQuery);
                setAttendingEvents(eventsSnapshot.size);

                const attendingNames = eventsSnapshot.docs.map(doc => doc.data().title);
                setAttendingEventNames(attendingNames);
            } catch (error) {
                console.error("Error fetching attending events:", error);
            }
        };
        fetchAttendingEvents();
    }, [currentUser.uid]);

    const toggleMinimized = (isMinimized) => {
        setMinimized(isMinimized);
    };

    const handleShowPopup = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleBriefingChange = (e) => {
        setBriefing(e.target.value);
    };

    const handleAddBriefing = async () => {
        if (briefing.trim() === "") {
            setBriefingError("Please enter a briefing.");
            return;
        }

        try {
            const userDocRef = doc(db, "teacher", currentUser.uid);
            await updateDoc(userDocRef, { briefing: briefing });
            setUserData(prevData => ({ ...prevData, briefing: briefing }));
            setShowConfirmation(false);
            setShowBriefingPopup(false);
            setShowSuccessMessage(true);
        } catch (error) {
            console.error("Error updating briefing:", error);
            setBriefingError("Error adding briefing. Please try again.");
        }
    };

    const handleShowBriefingPopup = () => {
        setShowBriefingPopup(true);
    };

    const handleCloseBriefingPopup = () => {
        setShowBriefingPopup(false);
    };

    const handleCertFileChange = (e) => {
        const file = e.target.files[0];
        setCertFile(file);
    };

    const handleUploadCertificate = async () => {
        try {
            if (!certFile || uploading) return; 

            setUploading(true);

           
            const fileExtension = certFile.name.split(".").pop();

            
            const storageRef = ref(getStorage(), `teachers/certificates/${currentUser.uid}_${Date.now()}.${fileExtension}`);

           
            const uploadTask = uploadBytesResumable(storageRef, certFile);

           
            const snapshot = await uploadTask;

           
            const downloadURL = await getDownloadURL(snapshot.ref);

            
            const userDocRef = doc(db, "teacher", currentUser.uid);
            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                const certificates = userData.certificates || [];
                certificates.push(downloadURL);
                await updateDoc(userDocRef, { certificates: certificates });
                setUserData(prevData => ({ ...prevData, certificates: certificates }));
                setCertFile(null);
                setShowCertPopup(false);
                
            } else {
                console.error("User data not found");
            }
            setUploading(false);
            setShowCertificateConfirmation(false)
            setShowSuccessMessage(true);
        } catch (error) {
            setUploading(false);
            console.error("Error uploading certificate:", error);
        }
    };

    const handleShowCertPopup = () => {
        setShowCertPopup(true);
    };

    const handleCloseCertPopup = () => {
        setShowCertPopup(false);
    };

    const handleDeleteCertificate = async (index) => {
        try {
            const userDocRef = doc(db, "teacher", currentUser.uid);
            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                const certificates = userData.certificates || []; 
                certificates.splice(index, 1); 
                await updateDoc(userDocRef, { certificates: certificates });
                setUserData(prevData => ({ ...prevData, certificates: certificates }));
                setDeleteIndex(null);  
                setShowDeleteMessage(false);
              setShowSuccessDeleteMessage(true);
            } else {
                console.error("User data not found");
            }  
            
        } catch (error) {
            console.error("Error deleting certificate:", error);
        }
    };

    const handleChangeSubmit = (e) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    const cancelChangeSubmit = () => {
        setShowConfirmation(false); 
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        setShowCertificateConfirmation(true);
    };

   

    return (
        <div className="App">
            <LTopBar />
            <LSideBar onToggleMinimized={toggleMinimized} />
            <div className={`content${minimized ? 'minimized' : ''}`}>
                {isLoading ? (
                    <div className="spinner-container">
                        <div className="spinner"></div>
                    </div>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div className="Portfolio">
                        <img className="Portfolio-image" src={userData.image} alt="User" />
                        <div className="Portfolio-container">
                            <h2 className="Portfolio-Name">{userData.name}</h2>
                            <h2>Briefing: {userData.briefing || "No briefing available"}</h2>
                            <div className="Portfolio-details">
                                <p><strong>Email:</strong>  {userData.email}</p>
                                <p><strong>Department: </strong> {userData.department}</p>
                                <p><strong>Scientific Title:</strong> {userData.scientifictitle}</p>
                                <p><strong>Presenting Events:</strong> {presentingEvents}</p>
                                <p><strong>Attending Events:</strong> {attendingEvents}</p>
                            </div>
                            {userData.certificates && (
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "98%" }}>
                                        {userData.certificates && (
                                            <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "20px", justifyContent: "space-evenly", width: "98%", backgroundColor: "#a9d2cb", borderRadius: "10px", boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}>
                                                {userData.certificates.map((certificate, index) => (
                                                    <div key={index} style={{ width: "30%", margin: "10px", textAlign: "center" }}>
                                                        <GrCertificate
                                                            style={{ fontSize: '3em', cursor: "pointer" }}
                                                            onClick={() => window.open(certificate, "_blank")}
                                                        />
                                                        <br />
                                                        <a href={certificate} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "black", wordWrap: "break-word" }}>{`Certificate ${index + 1}`}</a>
                                                        <br />
                                                        <button onClick={() => { setDeleteIndex(index); setShowDeleteMessage(true); }} className="DeleteCertificate" style={{ marginTop: "5px" }}>Delete</button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="Button-container">
                                <button onClick={handleShowPopup} className="ShowEvents">Show Events</button>
                                <button onClick={handleShowBriefingPopup} className="Brefing">Add Briefing</button>
                                <button onClick={handleShowCertPopup} className="Certificates">Add Certificate</button>
                            </div>
                            <br />
                        </div>
                    </div>
                )}
                {showPopup && (
                    <div className="Popup">
                        <div className="Popup-content">
                            <span className="Close-btn" onClick={handleClosePopup}>&times;</span>
                            <div className="events-container">
                                <div className="events-column">
                                    <h2>Presenting Events</h2>
                                    <ul>
                                        {presentingEventNames.map(name => (
                                            <li key={name}>{name}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="events-column">
                                    <h2>Attending Events</h2>
                                    <ul>
                                        {attendingEventNames.map(name => (
                                            <li key={name}>{name}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showBriefingPopup && (
                    <div className="Popup">
                        <div className="Popup-content">
                            <span className="Close-btn" onClick={handleCloseBriefingPopup}>&times;</span>
                            <div>
                                <h2>Add Briefing</h2>
                                <textarea value={briefing} onChange={handleBriefingChange} style={{ width: "90%" }}></textarea>
                                {briefingError && <p className="error">{briefingError}</p>}
                                <button onClick={handleChangeSubmit}>Add</button>
                            </div>
                        </div>
                    </div>
                )}
                {showCertPopup && (
                    <div className="Popup">
                        <div className="Popup-content">
                            <span className="Close-btn" onClick={handleCloseCertPopup}>&times;</span>
                            <div>
                                <h2>Add Certificate</h2>
                                <input type="file" accept=".png, .jpg, .pdf" onChange={handleCertFileChange} />
                                <button onClick={handleAddSubmit} disabled={uploading}>Upload</button>
                            </div>
                        </div>
                    </div>
                )}
              
            </div>
  {showDeleteMessage && (
                    <ConfirmationDialog
                        message={`Are you sure you want to delete this certificate?`}
                        onConfirm={() => handleDeleteCertificate(deleteIndex)}
                        onCancel={() => setShowDeleteMessage(false)}
                    />
                )}
            {showConfirmation && (
                <ConfirmationDialog
                    message="Are you sure you want to Add this briefing?"
                    onConfirm={handleAddBriefing}
                    onCancel={cancelChangeSubmit}
                />
            )}

{showCertificateConfirmation && (
                <ConfirmationDialog
                    message="Are you sure you want to Add this Certificate?"
                    onConfirm={handleUploadCertificate}
                    onCancel={() => setShowCertificateConfirmation(false)}
                />
            )}

{showSuccessDeleteMessage && (
            <DeleteDialog
              message=""
              onOk={() => setShowSuccessDeleteMessage(false)}
            />
          )}

          
{showSuccessMessage && (
        <SuccessMessage
          message="Add Successfully"
          onClose={() => setShowSuccessMessage(false)}
        />
      )}


        </div>
    );
};
export default Portfolio;
