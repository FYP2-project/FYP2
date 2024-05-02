import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../../../component/staff/SideBar";
import "../../../../css/TopBar.css"; 
import "../../../../App.css"
import TopBar from "../../../../component/staff/TopBar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../config/firebase-config";
import { useNavigate } from "react-router-dom";

const ManageSeminar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [minimized, setMinimized] = useState(true);
  const [presentations, setPresentations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const toggleMinimized = (isMinimized) => {
    setMinimized(isMinimized);
  };

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        const q = query(collection(db, "Events"), where("type", "==", "Seminar"));
        const querySnapshot = await getDocs(q);
        const presentationData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPresentations(presentationData);
      } catch (error) {
        console.error("Error fetching presentations:", error);
      }
    };
    fetchPresentations();
    setLoading(false); 
  }, []);

  // Filter presentations based on search query
  const filteredPresentations = presentations.filter((presentation) =>
    presentation.title.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h2>Manage Presentations</h2>
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search presentations"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="presentation-container">
            {filteredPresentations.map((presentation) => (
              <div
                key={presentation.id}
                className="presentation-rectangle"
                onClick={() => {
                  navigate(`/Events/ManageEvents/ManageSeminar/EditEvent/${presentation.id}`);
                }}
              >
                {presentation.image && <img src={presentation.image} alt="Presentation" />}
                <p className="presentation-title">{presentation.title}</p>
                <p>Date: {presentation.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ManageSeminar;
