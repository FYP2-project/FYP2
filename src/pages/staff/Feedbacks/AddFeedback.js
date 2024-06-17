import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../../component/staff/SideBar";
import "../../../css/TopBar.css"; 
import "../../../App.css"
import TopBar from "../../../component/staff/TopBar";
import { addFeedback } from "../../../redux/action";
import ConfirmationDialog from "../../../component/student/ConfirmationDialog";
import SuccessMessage from "../../../component/SuccessDialog";

const AddFeedback = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [minimized, setMinimized] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: "",
    enddate:"",
    status:"",
    image: "https://firebasestorage.googleapis.com/v0/b/fyp2-app-525c3.appspot.com/o/feedback%2FUntitled%20design.gif?alt=media&token=6fc740fd-6a3c-4e65-bec8-7e39dfba075b",
    questions: [], 
    questionTypes: [], 
  });

  const currentDate = new Date().toISOString().split('T')[0];
  const toggleMinimized = (isMinimized) => {
    setMinimized(isMinimized);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddQuestion = () => {

    setFormData({
      ...formData,
      questions: [...formData.questions, ""],
      questionTypes: [...formData.questionTypes, "answer"],
    });
  };

  const handleQuestionChange = (index, e) => {

    const questions = [...formData.questions];
    questions[index] = e.target.value;
    setFormData({ ...formData, questions });
  };

  const handleQuestionTypeChange = (index, e) => {

    const questionTypes = [...formData.questionTypes];
    questionTypes[index] = e.target.value;
    setFormData({ ...formData, questionTypes });
  };

  const handleRemoveQuestion = (index) => {

    const questions = [...formData.questions];
    const questionTypes = [...formData.questionTypes];
    questions.splice(index, 1);
    questionTypes.splice(index, 1);
    setFormData({ ...formData, questions, questionTypes });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
 
    const atLeastOneSelected = formData.questionTypes.every(type => type === "Q&A" || type === "Rating");

    if (!atLeastOneSelected) {
      alert("One of the Question Type is not selected for all questions!");
      return; 
    }
    dispatch(addFeedback(formData));
 
    setFormData({
      title: "",
      content: "",
      date: "",
      enddate:"",
      status:"",
      questions: [],
      questionTypes: [],
    });
    setShowConfirmation(false);
    setShowSuccessMessage(true);
  };
  const handleAddFeedbackConfirm = (e) => {
    e.preventDefault();
    setShowConfirmation(true); 
  };

  const cancelAddFeedbackConfirm = () => {
    setShowConfirmation(false);
  };


  return (
    <div className="App">
      <TopBar />
      <SideBar onToggleMinimized={toggleMinimized} />
      <div>
        <div className={`content${minimized ? 'minimized' : ''}`}>
          <h1>Feedback Form</h1>
          <form onSubmit={handleAddFeedbackConfirm}>
            <input
            className="AddNewEventInput"
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            
             <input
             className="AddNewEventInput"
              type="date"
              name="date"
              placeholder="Date"
              value={formData.date}
              onChange={handleChange}
              min={currentDate}
              required
            />
            <h5 className="event-image-info">please enter a date to end the Feedback the feedback will end at the 11:59 PM of that day</h5>
             <input
             className="AddNewEventInput"
              type="date"
              name="enddate"
              placeholder="Date"
              value={formData.enddate}
              onChange={handleChange}
              min={currentDate}
              required
            />
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              
            >
              <option value="">Select Status</option>
              <option value="ongoing">Ongoing</option>
              <option value="close">Close</option>
            </select>
            <textarea
              name="content"
              placeholder="Description"
              value={formData.content}
              onChange={handleChange}
              required
            ></textarea>
        
            {formData.questions.map((question, index) => (
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
                    value="Q&A"
                    checked={formData.questionTypes[index] === "Q&A"}
                    onChange={(e) => handleQuestionTypeChange(index, e)}
                    
                  />
                  Q&A
                </label>
                <label>
                  <input
                    type="radio"
                    name={`questionType${index}`}
                    value="Rating"
                    checked={formData.questionTypes[index] === "Rating"}
                    onChange={(e) => handleQuestionTypeChange(index, e)}
                    
                  />
                  Rating
                </label>
                <button className="RemoveButton" type="button" onClick={() => handleRemoveQuestion(index) } disabled={formData.questions.length === 1}>Remove Question</button>
              </div>
            ))}
               <br/>
            <button className="AddButton" type="button" onClick={handleAddQuestion}>Add Question</button>
            <br/>
            <button type="submit" disabled={formData.questions.length === 0}>Submit Feedback</button>
          </form>
        </div>
      </div>
      {showConfirmation && (
            <ConfirmationDialog
              message="Are you sure you want to Add this Feedback?"
              onConfirm={handleSubmit}
              onCancel={cancelAddFeedbackConfirm}
            />
          )}

{showSuccessMessage && (
        <SuccessMessage
          message="New Feedback added successfully"
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
    </div>
  );
};
export default AddFeedback;
