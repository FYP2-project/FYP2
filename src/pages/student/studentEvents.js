import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../css/TopBar.css"; 
import "../../App.css"
import { useNavigate } from "react-router-dom";
import StudentTopBar from "../../component/student/StudnetTopBar";
import StudentSideBar from "../../component/student/StudentSideBar";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase-config";

const StudentEvents = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [minimized, setMinimized] = useState(true);
  const [otherEvents, setOtherEvents] = useState([]);
  const [filterType, setFilterType] = useState(""); 
  const [filterOnline, setFilterOnline] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  const toggleMinimized = (isMinimized) => {
    setMinimized(isMinimized);
  };

  useEffect(() => {
    const fetchOtherEvents = async () => {
      try {
        let q = collection(db, "Events");
        q = query(q, where("status", "==", "open"));

        // Apply filters if set
        if (filterType !== "") {
          q = query(q, where("type", "==", filterType));
        }

        if (filterOnline !== "") {
          q = query(q, where("Online", "==", filterOnline));
        }

        const querySnapshot = await getDocs(q);
        const otherEventData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort events based on date in descending order
        otherEventData.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });

        setOtherEvents(otherEventData);
        setLoading(false); // Data fetched, so set loading to false
      } catch (error) {
        console.error("Error fetching OtherEvents:", error);
      }
    };
    fetchOtherEvents();
  }, [filterType, filterOnline]);

  // Function to handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to filter events by title based on search query
  const filteredEvents = otherEvents.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="App">
      <StudentTopBar />
      <StudentSideBar onToggleMinimized={toggleMinimized} />
      <div>
        <div className={`content${minimized ? "minimized" : ""}`}>
          <h2>Current Events</h2>
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search by title"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {/* Select dropdown to filter events */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>  
            <option value="Seminar">Seminar</option>
            <option value="Presentation">Presentation</option>
            <option value="Workshop">Workshop</option>
            <option value="Other">Other</option>
          
          </select>
          <select
            value={filterOnline}
            onChange={(e) => setFilterOnline(e.target.value)}
          >
            <option value="">Event Status</option>
            <option value="yes">Online</option>
            <option value="no">Offline</option>
            <option value="both">Both</option>
          </select>
          {loading ? (
            <div className="spinner-container">
            <div className="spinner"></div>
          </div>
          ) : (
            <div className="presentation-container">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="presentation-rectangle"
                  onClick={() => {
                    navigate(`/Student/Events/register/${event.id}`);
                  }}
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
    </div>
  );
};


export default StudentEvents;
