import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../../../component/staff/SideBar";
import "../../../../css/TopBar.css"; 
import "../../../../App.css"
import TopBar from "../../../../component/staff/TopBar";
import { useNavigate, useParams } from "react-router-dom";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebase-config";
import ConfirmationDialog from "../../../../component/student/ConfirmationDialog";
import DeleteDialog from "../../../../component/DeleteDialog";
import { deleteFeedback, updateFeedback } from "../../../../redux/action";
import SuccessMessage from "../../../../component/SuccessDialog";

const EditFeedback = () => {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [minimized, setMinimized] = useState(true);
    const [feedbackData, setFeedbackData] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
    const [showConfirmation,setShowConfirmation ] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showDeleteMessage, setShowDeleteMessage] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);  
       const [loading, setLoading] = useState(true);

    const toggleMinimized = (isMinimized) => {
      setMinimized(isMinimized);
    };
   
    useEffect(() => {
      const fetchFeedbackData = async () => {
        try {
          const feedbackDocRef = doc(db, "feedback", id);
          const feedbackDocSnapshot = await getDoc(feedbackDocRef);
          if (feedbackDocSnapshot.exists()) {
            const feedbackData = feedbackDocSnapshot.data();
            setFeedbackData(feedbackData);
          } else {
            console.error("Feedback not found");
          }
        } catch (error) {
          console.error("Error fetching feedback data:", error);
        }
      };
      fetchFeedbackData();
      setLoading(false); 
    }, [id]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFeedbackData({ ...feedbackData, [name]: value });
    };
  
    const handleAddQuestion = () => {
      // Add a new question to the questions array and set its type to 'answer' by default
      setFeedbackData({
        ...feedbackData,
        questions: [...feedbackData.questions, ""],
        questionTypes: [...feedbackData.questionTypes, "answer"],
      });
    };
  
    const handleQuestionChange = (index, e) => {
      // Update the question at the specified index
      const questions = [...feedbackData.questions];
      questions[index] = e.target.value;
      setFeedbackData({ ...feedbackData, questions });
    };
  
    const handleQuestionTypeChange = (index, e) => {
      // Update the question type at the specified index
      const questionTypes = [...feedbackData.questionTypes];
      questionTypes[index] = e.target.value;
      setFeedbackData({ ...feedbackData, questionTypes });
    };
  
    const handleRemoveQuestion = (index) => {
      // Remove the question and question type at the specified index
      const questions = [...feedbackData.questions];
      const questionTypes = [...feedbackData.questionTypes];
      questions.splice(index, 1);
      questionTypes.splice(index, 1);
      setFeedbackData({ ...feedbackData, questions, questionTypes });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        dispatch(updateFeedback(id, feedbackData));
      } catch (error) {
        console.error("Error updating feedback:", error);
      }
      setShowConfirmation(false);
      setShowSuccessMessage(true);
    };

    const handleDeleteFeedback = async () => {
      try {
        dispatch(deleteFeedback(id));
        // Redirect to feedback list page after deletion
        setShowDelete(false);
        setShowDeleteMessage(true); 
      } catch (error) {
        console.error("Error deleting feedback:", error);
      }
    };

    const handleUpdateConfirm = (e) => {
      e.preventDefault();
      setShowConfirmation(true); // Show confirmation dialog
    };
  
    const cancelUpdateConfirm = () => {
      setShowConfirmation(false); // Hide confirmation dialog if user cancels
    };

    const handleDeleteConfirm = (e) => {
      e.preventDefault();
      setShowDelete(true); 
    };
  
    const cancelDeleteConfirm = () => {
      setShowDelete(false); 
    };
    const DeleteMessgae = () => {
      setShowDeleteMessage(false); 
    navigate("/FeedBack/ManageFeedBack");
  };


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
            <h2>Edit Feedback</h2>
            <form onSubmit={handleUpdateConfirm}>
              <input
              className="AddNewEventInput"
                type="text"
                name="title"
                placeholder="Title"
                value={feedbackData.title || ""}
                onChange={handleChange}
                required
              />
               <input
               className="AddNewEventInput"
              type="date"
              name="date"
              placeholder="Date"
              value={feedbackData.date}
              onChange={handleChange}
              required
            />
             <h5 className="event-image-info">Feedback End Date</h5>
             <input
             className="AddNewEventInput"
              type="date"
              name="enddate"
              placeholder="Date"
              value={feedbackData.enddate}
              onChange={handleChange}
              required
            />
              <textarea
                name="content"
                placeholder="Description"
                value={feedbackData.content || ""}
                onChange={handleChange}
                required
              ></textarea>
              {/* Render input fields for questions */}
              {feedbackData.questions && feedbackData.questions.map((question, index) => (
                <div className="QustionsConstainer" key={index}>
                  <input
                  className="Qustions"
                    type="text"
                    placeholder={`Question ${index + 1}`}
                    value={question}
                    onChange={(e) => handleQuestionChange(index, e)}
                    required
                  />
                  <label>
                    <input
                      type="radio"
                      name={`questionType${index}`}
                      value="answer"
                      checked={feedbackData.questionTypes[index] === "answer"}
                      onChange={(e) => handleQuestionTypeChange(index, e)}
                    />
                    Q&A
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`questionType${index}`}
                      value="multipleChoice"
                      checked={feedbackData.questionTypes[index] === "multipleChoice"}
                      onChange={(e) => handleQuestionTypeChange(index, e)}
                    />
                    Rating
                  </label>
                  <button className="RemoveButton" type="button" onClick={() => handleRemoveQuestion(index)}>Remove Question</button>
                </div>
              ))}
              <br/>
              <button className="AddButton"  type="button" onClick={handleAddQuestion}>Add Question</button>
              <br/>
              <button  type="submit">Update Feedback</button>
              <br/>
              <button className="DeleteButton" type="button" onClick={handleDeleteConfirm}>Delete Feedback</button>
            </form>
            
          </div>
        </div>

        {showConfirmation && (
            <ConfirmationDialog
              message="Are you sure you want to Update this Feedback?"
              onConfirm={handleSubmit}
              onCancel={cancelUpdateConfirm}
            />
          )}
           {showDelete && (
            <ConfirmationDialog
              message="Are you sure you want to delete this Feedback?"
              onConfirm={handleDeleteFeedback}
              onCancel={cancelDeleteConfirm}
            />
          )}

{showDeleteMessage && (
            <DeleteDialog
              message=""
              onOk={DeleteMessgae}
            />
          )}

{showSuccessMessage && (
        <SuccessMessage
          message="Feedback updated successfully"
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
      </div>
    );
  };


export default EditFeedback;
