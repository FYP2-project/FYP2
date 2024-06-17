import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../../../component/staff/SideBar";
import "../../../../css/TopBar.css"; 
import "../../../../App.css"
import TopBar from "../../../../component/staff/TopBar";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../config/firebase-config";
import BarChart from "../../../../component/bar";

const FeedbackUserList = () => {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [minimized, setMinimized] = useState(true);
    const [userAnswers, setUserAnswers] = useState([]);
    const [feedbackTitle, setFeedbackTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
  
    const toggleMinimized = (isMinimized) => {
      setMinimized(isMinimized);
    };
  
    useEffect(() => {
      const fetchUserAnswers = async () => {
        try {
          const feedbackDocRef = doc(db, "feedback", id);
          const feedbackDocSnapshot = await getDoc(feedbackDocRef);
          if (feedbackDocSnapshot.exists()) {
            const feedbackData = feedbackDocSnapshot.data();
            setFeedbackTitle(feedbackData.title); 
            if (feedbackData.FeedbackAnswer) {
              
              const usersAnswers = await Promise.all(
                feedbackData.FeedbackAnswer.map(async (answer) => {
                  const userDocRef = doc(db, "student", answer.uid);
                  const userDocSnapshot = await getDoc(userDocRef);
                  if (userDocSnapshot.exists()) {
                    return { ...answer, userData: userDocSnapshot.data() };
                  } else {
                    console.error("User not found:", answer.uid);
                  }
                })
              );
              setUserAnswers(usersAnswers.filter((answer) => answer)); 
            }
          } else {
            console.error("Feedback not found");
          }
        } catch (error) {
          console.error("Error fetching user answers:", error);
        } finally {
          setLoading(false); 
        }
      };
  
      fetchUserAnswers();
    }, [id]);
  
    const calculateAverageAnswers = () => {
      const averages = [];
      const questionCounts = {};
      const questionData = []; 
    
      userAnswers.forEach((answer) => {
        if (answer.answers && answer.questionTypes) {
          answer.answers.forEach((userAnswer, index) => {
            if (answer.questionTypes[index] === "Rating") {
              const questionIndex = index.toString();
              if (!questionCounts[questionIndex]) {
                questionCounts[questionIndex] = { total: 0, count: 0 };
              }
              questionCounts[questionIndex].total += parseInt(userAnswer, 10);
              questionCounts[questionIndex].count++;
            }
          });
        }
      });
    
      for (const index in questionCounts) {
        const average = questionCounts[index].total / questionCounts[index].count;
        averages.push(average);
        questionData.push({ questionNumber: index, averageRating: average }); 
      }
    
      return questionData; 
    };
  
    return (
      <div className="App">
        <TopBar />
        <SideBar onToggleMinimized={toggleMinimized} />
        <div className={`content${minimized ? "minimized" : ""}`}>
          <h1>Feedback User List</h1>
         <h1 className="event-title">Title: {feedbackTitle}</h1> 
          {loading ? ( 
              <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <> 
            <div className="user-answers-container">
              {userAnswers.length > 0 ? (
                userAnswers.map((answer, index) => (
                  <div key={index} className="user-answer">
                    <img className="UserFeedbackImage" src={answer.userData.image} alt="User" />
                    <p style={{fontWeight:"bold"}}>Name: {answer.userData.email}</p>
                    {answer.answers && answer.questions && answer.answers.map((userAnswer, answerIndex) => (
                      <div key={answerIndex} className="question-answer">
                        <p>Question {answerIndex + 1}: {answer.questions[answerIndex]}</p>
                        <p>Answer {answerIndex + 1}: {userAnswer}</p>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p>No answer yet</p>
              )}
            </div></>
          )}
          <br/>
          <br/>
         
          <div className="bar-chart-container">
          <BarChart questionData={calculateAverageAnswers()} />
      </div>
        </div>
        
      </div>
    );
  };



export default FeedbackUserList;
