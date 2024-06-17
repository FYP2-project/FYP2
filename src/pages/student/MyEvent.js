import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../css/TopBar.css"; 
import "../../App.css"
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import StudentTopBar from "../../component/student/StudnetTopBar";
import StudentSideBar from "../../component/student/StudentSideBar";

const MyEvent = () => {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [minimized, setMinimized] = useState(true);
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const toggleMinimized = (isMinimized) => {
      setMinimized(isMinimized);
    };
  
    useEffect(() => {
        const fetchMyEvents = async () => {
          try {
            console.log("Fetching events...");
            const eventsRef = collection(db, "Events");
            const querySnapshot = await getDocs(eventsRef);
            const eventsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            const myEvents = eventsData.filter((event) =>
              Array.isArray(event.participate) && event.participate.some((participant) => participant.uid === currentUser.uid)
            );

            
            myEvents.sort((a, b) => {
              const dateA = new Date(a.date).getTime();
              const dateB = new Date(b.date).getTime();
              return dateB - dateA;
            });

            console.log("Fetched events:", myEvents);
            setMyEvents(myEvents);
          } catch (error) {
            console.error("Error fetching events:", error);
          }
        };
      
        if (currentUser && currentUser.uid) {
          fetchMyEvents();
        } else {
          console.log("User UID not available.");
        }
        setLoading(false); 
      }, [currentUser]);
  

      if (loading) {
        return (
          <>  <StudentTopBar />
          <StudentSideBar onToggleMinimized={toggleMinimized} />
           <div className="spinner-container">
                  <div className="spinner"></div>
                </div>
          </>
        
        );
      }


    return (
      <div className="App">
        <StudentTopBar />
        <StudentSideBar onToggleMinimized={toggleMinimized} />
        <div className={`content${minimized ? "minimized" : ""}`}>
          <h1>Registered Events</h1>
          {myEvents.length === 0 ? (
            <p>You did not participate in any event yet.</p>
          ) : (
            
                    <div className="presentation-container">
                {myEvents.map((event) => (
                  <div
                    key={event.id}
                    className="My-presentation-rectangle"
                   
                  >
                    {event.image && (
                      <img src={event.image} alt="Presentation" />
                    )}
                    <p className="presentation-title">{event.title}</p>
                    <p>Date: {event.date}</p>
                 
                  </div>
                ))}
              </div>

                
              )}
                
           
          
        </div>
      </div>
    );
  };
  

export default MyEvent;
