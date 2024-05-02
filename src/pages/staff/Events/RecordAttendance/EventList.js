import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../../../component/staff/SideBar";
import "../../../../css/TopBar.css"; 
import "../../../../App.css"
import TopBar from "../../../../component/staff/TopBar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../config/firebase-config";
import { useNavigate } from "react-router-dom";

const EventList = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [minimized, setMinimized] = useState(true);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const toggleMinimized = (isMinimized) => {
    setMinimized(isMinimized);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "Events"));
        const querySnapshot = await getDocs(q);
        const eventData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
    setLoading(false); 
  }, []);

  // Filter events based on search query
  const filteredEvents = events.filter((event) =>
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
          <h2>Student Attendance</h2>
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search events"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="presentation-container">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="presentation-rectangle"
                onClick={() => {
                  navigate(`/Events/AttendanceType/Student/${event.id}`);
                }}
              >
                {event.image && <img src={event.image} alt="Event" />}
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
export default EventList;