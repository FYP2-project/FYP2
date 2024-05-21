import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../css/TopBar.css"; 
import "../../App.css"
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { Link } from "react-router-dom";
import StudentTopBar from "../../component/student/StudnetTopBar";
import StudentSideBar from "../../component/student/StudentSideBar";

const FeedbackList = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [minimized, setMinimized] = useState(true);
  const [feedbackList, setFeedbackList] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [loading, setLoading] = useState(true);
  const toggleMinimized = (isMinimized) => {
    setMinimized(isMinimized);
  };
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const feedbackCollectionRef = collection(db, "feedback");
        const feedbackQuery = query(feedbackCollectionRef, where("status", "==", "ongoing")); 
        const feedbackSnapshot = await getDocs(feedbackQuery);

        let feedbackData = feedbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

       
        feedbackData.sort((a, b) => new Date(b.date) - new Date(a.date));

        setFeedbackList(feedbackData);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);


  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter feedback list based on search query
  const filteredFeedbackList = feedbackList.filter((feedback) =>
    feedback.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div>
        <div className={`content${minimized ? 'minimized' : ''}`}>
          <h1>Feedback</h1>
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search by title"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="feedback-container">
            {filteredFeedbackList.map((feedback, index) => (
              <Link to={`/FeedbackList/GiveFeedback/${feedback.id}`} key={index} className="feedback-link">
                <div className="feedback-item">
                  <img  src={feedback.image}/>
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

export default FeedbackList;
