import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../css/TopBar.css"; 
import "../../../App.css"
import StudentTopBar from "../../../component/student/StudnetTopBar";
import StudentSideBar from "../../../component/student/StudentSideBar";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebase-config";
import { useParams } from "react-router-dom";
import ConfirmationDialog from "../../../component/student/ConfirmationDialog";
import SuccessMessage from "../../../component/SuccessDialog";

const GiveFeedback = ({ match }) => {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [minimized, setMinimized] = useState(true);
    const [feedback, setFeedback] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]); // State to store user's answers
    const [hasAnswered, setHasAnswered] = useState(false); // State to track if the user has answered already
    const [showConfirmation, setShowConfirmation] = useState(false); 
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);  
    const { id } = useParams();
    const currentDate = new Date().toISOString().split('T')[0]; 
    const [loading, setLoading] = useState(true);
    const toggleMinimized = (isMinimized) => {
      setMinimized(isMinimized);
    };
  
    useEffect(() => {
      const fetchFeedback = async () => {
        try {
          const feedbackDocRef = doc(db, "feedback", id);
          const feedbackDocSnapshot = await getDoc(feedbackDocRef);
          if (feedbackDocSnapshot.exists()) {
            const feedbackData = feedbackDocSnapshot.data();
            setFeedback(feedbackData);
  
            // Check if user's UID is in the FeedbackAnswer array
            if (feedbackData.FeedbackAnswer) {
              const userAnswerIndex = feedbackData.FeedbackAnswer.findIndex(answer => answer.uid === currentUser.uid);
              if (userAnswerIndex !== -1) {
                // User has already answered, disable the form submission
                setHasAnswered(true);
              }
            }
  
            // Initialize userAnswers state with empty answers array
            const initialAnswers = feedbackData.questions.map(() => "");
            setUserAnswers(initialAnswers);
          } else {
            console.error("Feedback not found");
          }
        } catch (error) {
          console.error("Error fetching feedback:", error);
        }
      };
  
      fetchFeedback();
      setLoading(false); 
    }, [id, currentUser.uid]);
  
    const handleInputChange = (index, event) => {
      const newAnswers = [...userAnswers];
      newAnswers[index] = event.target.value;
      setUserAnswers(newAnswers);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault(); 
      if (feedback.enddate < currentDate) {
        alert("The feedback submission deadline has passed.");
        return; // Prevent form submission
      }
    
      
      try {
        const feedbackDocRef = doc(db, "feedback", id);
        await updateDoc(feedbackDocRef, {
          FeedbackAnswer: arrayUnion({ 
            uid: currentUser.uid, 
            answers: userAnswers,
            questions: feedback.questions,
            questionTypes: feedback.questionTypes
          }),
        });
        console.log("Feedback submitted successfully");
        setHasAnswered(true);
        setShowConfirmation(false); 
        setShowSuccessMessage(true);
      } catch (error) {
        console.error("Error submitting feedback:", error);
      }
    };


    const handleFeedbackSubmit = (e) => {
      e.preventDefault();
      for (let i = 0; i < feedback.questions.length; i++) {
        if (feedback.questionTypes[i] === "multipleChoice") {
          const answer = userAnswers[i];
          if (!answer || answer < 1 || answer > 5) {
            alert("Please select a rating from 1 to 5 for each Rating question.");
            return; // Prevent form submission
          }
        } else {
          // Check if answer questions have at least 2 characters
          const answer = userAnswers[i];
          if (!answer || answer.length < 2) {
            alert("Q&A questions must have at least 2 characters.");
            return; // Prevent form submission
          }
        }
      }
      setShowConfirmation(true);
    };

    const cancelFeedbackSubmit = () => {
      setShowConfirmation(false); // Hide confirmation dialog if user cancels
    };


    const isFeedbackDateToday = feedback && feedback.enddate < currentDate;

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
          {feedback ? (
            <div>
              <img className="EventImage" src={feedback.image}/>
              <div className="event-details">
              <h1 className="event-title">{feedback.title}</h1>
              <p><strong>Date:</strong> {feedback.date}</p>
              <p><strong>Description:</strong> {feedback.content}</p>
              
              <br/>
              {!hasAnswered ? (
                <form  onSubmit={handleFeedbackSubmit}>
                  {feedback.questions.map((question, index) => (
                    <div className="GivefeedbackForm" key={index}>
                      <p><strong>Qustions {index + 1}:</strong> {question} {feedback.questionTypes[index] === "multipleChoice" ? "" :""}</p>
                      {feedback.questionTypes[index] === "multipleChoice" ? (
                        <select
                        className="feedback-select"
                          value={userAnswers[index]}
                          onChange={(event) => handleInputChange(index, event)}
                          required
                        
                        >
                          <option value="">Select rating (1-5)</option>
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <option key={rating} value={rating}>
                              {rating}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                        className="FeebackInput"
                          type="text"
                          value={userAnswers[index]}
                          onChange={(event) => handleInputChange(index, event)}
                          placeholder="Your answer"
                          required
                        />
                      )}
                      
                    </div>
                  ))}
                   <p style={{color:"red"}}>Please be aware that the feedback will no longer be available to answer after: {feedback.enddate} 11:59 PM</p>
                  <br/>
                  <button disabled={isFeedbackDateToday} type="submit">Submit</button>
                </form>
              ) : (
                <button style={{width:"100%"}} disabled>You have already answered this feedback.</button>
              )}
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
          {/* Confirmation Dialog */}
       {showConfirmation && (
            <ConfirmationDialog
              message="Are you sure you want to submit this feedback?"
              onConfirm={handleSubmit}
              onCancel={cancelFeedbackSubmit}
            />
          )}

{showSuccessMessage && (
        <SuccessMessage
          message="Feedback submitedd successfully"
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
      </div>
    );
  };

export default GiveFeedback;
