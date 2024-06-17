import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../../component/staff/SideBar";
import "../../../css/TopBar.css"; 
import "../../../App.css"
import TopBar from "../../../component/staff/TopBar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase-config";
import { Link } from "react-router-dom";

const ManageFeedBack = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [minimized, setMinimized] = useState(true);
  const [feedbackList, setFeedbackList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const toggleMinimized = (isMinimized) => {
    setMinimized(isMinimized);
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const feedbackCollectionRef = collection(db, "feedback");
        const feedbackSnapshot = await getDocs(feedbackCollectionRef);
        const feedbackData = feedbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeedbackList(feedbackData);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
    setLoading(false); 
  }, []);

  
  const filteredFeedback = feedbackList.filter((feedback) =>
    feedback.title.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className={`content${minimized ? 'minimized' : ''}`}>
          <h1>Manage Feedback</h1>
   
          <input
            type="text"
            placeholder="Search feedback"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="feedback-container">
            {filteredFeedback.map((feedback, index) => (
              <Link to={`/FeedBack/ManageFeedBack/EditFeedback/${feedback.id}`} key={index} className="feedback-link">
                <div className="feedback-item">
                  <img src={feedback.image}/>
                  <p className="feedback-title">{feedback.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ManageFeedBack;
