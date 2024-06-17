import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../../../component/staff/SideBar";
import "../../../../css/TopBar.css"; 
import "../../../../App.css"
import TopBar from "../../../../component/staff/TopBar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../config/firebase-config";
import { useNavigate } from "react-router-dom";

const ManageOtherEvent = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [minimized, setMinimized] = useState(true);
  const [otherEvents, setOtherEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const toggleMinimized = (isMinimized) => {
    setMinimized(isMinimized);
  };

  useEffect(() => {
    const fetchOtherEvents = async () => {
      try {
        const q = query(collection(db, "Events"), where("type", "==", "Other"));
        const querySnapshot = await getDocs(q);
        const otherEventData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOtherEvents(otherEventData);
      } catch (error) {
        console.error("Error fetching OtherEvents:", error);
      }
    };
    fetchOtherEvents();
    setLoading(false); 
  }, []);

  
  const filteredOtherEvents = otherEvents.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <>  <TopBar />
      <SideBar onToggleMinimized={toggleMinimized} />
       <div className="spinner-container">
              <div className="spinner"></div>
            </div>
      </>
    
    );
  }

  return (
    <div className="App">
      <TopBar />
      <SideBar onToggleMinimized={toggleMinimized} />
      <div>
        <div className={`content${minimized ? "minimized" : ""}`}>
          <h2>Manage Other Events</h2>
 
          <input
            type="text"
            placeholder="Search other events"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="presentation-container">
            {filteredOtherEvents.map((event) => (
              <div
                key={event.id}
                className="presentation-rectangle"
                onClick={() => {
                  navigate(`/Events/ManageEvents/ManageOtherEvent/EditEvent/${event.id}`);
                }}
              >
                {event.image && <img src={event.image} alt="Presentation" />}
                <p className="presentation-title">{event.title}</p>
                <p>Date: {event.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ManageOtherEvent;
