import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GrCertificate } from "react-icons/gr";
import "../../../css/TopBar.css"; 
import "../../../App.css"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../config/firebase-config";
import { useParams } from "react-router-dom";
import TopBar from "../../../component/staff/TopBar";
import SideBar from "../../../component/staff/SideBar";


const LecturerPortfolio = () => {
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
    const { id } = useParams(); // Extract the lecturer ID from the URL params

    const toggleMinimized = (isMinimized) => {
        setMinimized(isMinimized);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDocRef = doc(db, "teacher", id); // Use the extracted lecturer ID
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    setUserData(userData);
                    setIsLoading(false);
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
                const eventsQuery = query(collection(db, "Events"), where("presenting", "array-contains", id));
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
                const eventsQuery = query(collection(db, "Events"), where("attending", "array-contains", id)); 
                const eventsSnapshot = await getDocs(eventsQuery);
                setAttendingEvents(eventsSnapshot.size); 

                const attendingNames = eventsSnapshot.docs.map(doc => doc.data().title);
                setAttendingEventNames(attendingNames);
            } catch (error) {
                console.error("Error fetching attending events:", error);
            }
        };
        fetchAttendingEvents();
    }, [id]);

    const handleShowPopup = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="App">
           <TopBar />
           <SideBar onToggleMinimized={toggleMinimized} />
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
                            <h2>Briefing: {userData.briefing}</h2>
                            <div className="Portfolio-details">
                                <p><strong>Email:</strong> {userData.email}</p>
                                <p><strong>Department:</strong> {userData.department}</p>
                                <p><strong>Scientific Title: </strong>{userData.scientifictitle}</p>
                                <p><strong>Presenting Events: </strong>{presentingEvents}</p> 
                                <p><strong>Attending Events:</strong> {attendingEvents}</p>
                            </div>
                            {userData.certificates && (
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "98%", }}>
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
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="Button-container">
                                <button onClick={handleShowPopup} className="ShowEvents">Show Events</button>
                            </div>  
                            <br/>
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
            </div>
        </div>
    );
};


export default LecturerPortfolio;
