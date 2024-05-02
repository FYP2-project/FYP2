import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../../../component/staff/SideBar";
import "../../../../css/TopBar.css"; 
import "../../../../App.css"
import TopBar from "../../../../component/staff/TopBar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../config/firebase-config";
import { useNavigate } from "react-router-dom";

const ManageWorkShop = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [minimized, setMinimized] = useState(true);
  const [workshops, setWorkshops] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const toggleMinimized = (isMinimized) => {
    setMinimized(isMinimized);
  };

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const q = query(collection(db, "Events"), where("type", "==", "Workshop"));
        const querySnapshot = await getDocs(q);
        const workshopData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWorkshops(workshopData);
      } catch (error) {
        console.error("Error fetching Workshops:", error);
      }
    };
    fetchWorkshops();
    setLoading(false); 
  }, []);

  // Filter workshops based on search query
  const filteredWorkshops = workshops.filter((workshop) =>
    workshop.title.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h2>Manage Workshop</h2>
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search workshops"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="presentation-container">
            {filteredWorkshops.map((workshop) => (
              <div
                key={workshop.id}
                className="presentation-rectangle"
                onClick={() => {
                  navigate(`/Events/ManageEvents/ManageWorkShop/EditEvent/${workshop.id}`);
                }}
              >
                {workshop.image && <img src={workshop.image} alt="Workshop" />}
                <p className="presentation-title">{workshop.title}</p>
                <p>Date: {workshop.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ManageWorkShop;
