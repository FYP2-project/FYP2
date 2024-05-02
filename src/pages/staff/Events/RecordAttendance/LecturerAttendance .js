import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../../../component/staff/SideBar";
import "../../../../css/TopBar.css"; 
import "../../../../App.css"
import TopBar from "../../../../component/staff/TopBar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../config/firebase-config";
import { useNavigate } from "react-router-dom";

const LecturerAttendance  = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [minimized, setMinimized] = useState(true);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFacility, setSelectedFacility] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const toggleMinimized = (isMinimized) => {
    setMinimized(isMinimized);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let q = query(collection(db, "Events"));
        if (selectedFacility) {
          q = query(collection(db, "Events"), where("Faculty", "==", selectedFacility));
        }
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
  }, [selectedFacility]);

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
          <h2>Lecturer Attendance</h2>
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search events"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
      
          <select value={selectedFacility} onChange={(e) => setSelectedFacility(e.target.value)}>
            <option value="">All Faculty</option>
            <option value="Faculty of Dentistry">Faculty of Dentistry</option>
              <option value="Faculty of Pharmacy">Faculty of Pharmacy</option>
              <option value="Faculty of Engineering & Computer Science">Faculty of Engineering & Computer Science</option>
              <option value="Faculty of Health Sciences">Faculty of Health Sciences</option>
              <option value="Faculty of Management and Social Sciences">Faculty of Management and Social Sciences</option>
          </select>
          <div className="presentation-container">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="presentation-rectangle"
                onClick={() => {
                  navigate(`/Events/AttendanceType/Lecturer/${event.id}`);
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
export default LecturerAttendance;
