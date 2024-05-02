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
    image: "https://firebasestorage.googleapis.com/v0/b/fyp2-app-525c3.appspot.com/o/feedback%2FUntitled%20design.gif?alt=media&token=6fc740fd-6a3c-4e65-bec8-7e39dfba075b",
    questions: [], // Array to store questions
    questionTypes: [], // Array to store question types (multiple choice or answer)
  });

  const toggleMinimized = (isMinimized) => {
    setMinimized(isMinimized);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddQuestion = () => {
    // Add a new question to the questions array and set its type to 'answer' by default
    setFormData({
      ...formData,
      questions: [...formData.questions, ""],
      questionTypes: [...formData.questionTypes, "answer"],
    });
  };

  const handleQuestionChange = (index, e) => {
    // Update the question at the specified index
    const questions = [...formData.questions];
    questions[index] = e.target.value;
    setFormData({ ...formData, questions });
  };

  const handleQuestionTypeChange = (index, e) => {
    // Update the question type at the specified index
    const questionTypes = [...formData.questionTypes];
    questionTypes[index] = e.target.value;
    setFormData({ ...formData, questionTypes });
  };

  const handleRemoveQuestion = (index) => {
    // Remove the question and question type at the specified index
    const questions = [...formData.questions];
    const questionTypes = [...formData.questionTypes];
    questions.splice(index, 1);
    questionTypes.splice(index, 1);
    setFormData({ ...formData, questions, questionTypes });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
 
    // Dispatch the action to add feedback
    dispatch(addFeedback(formData));
    // Optionally, you can clear the form fields after submission
    setFormData({
      title: "",
      content: "",
      date: "",
      enddate:"",
      questions: [],
      questionTypes: [],
    });
    setShowConfirmation(false);
    setShowSuccessMessage(true);
  };
  const handleAddFeedbackConfirm = (e) => {
    e.preventDefault();
    setShowConfirmation(true); // Show confirmation dialog
  };

  const cancelAddFeedbackConfirm = () => {
    setShowConfirmation(false); // Hide confirmation dialog if user cancels
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
              required
            />
            <h5 className="event-image-info">Feedback End Date</h5>
             <input
             className="AddNewEventInput"
              type="date"
              name="enddate"
              placeholder="Date"
              value={formData.enddate}
              onChange={handleChange}
              required
            />
            <textarea
              name="content"
              placeholder="Description"
              value={formData.content}
              onChange={handleChange}
              required
            ></textarea>
            {/* Render input fields for questions */}
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
                    value="answer"
                    checked={formData.questionTypes[index] === "answer"}
                    onChange={(e) => handleQuestionTypeChange(index, e)}
                  />
                  Q&A
                </label>
                <label>
                  <input
                    type="radio"
                    name={`questionType${index}`}
                    value="multipleChoice"
                    checked={formData.questionTypes[index] === "multipleChoice"}
                    onChange={(e) => handleQuestionTypeChange(index, e)}
                  />
                  Rating
                </label>
                <button className="RemoveButton" type="button" onClick={() => handleRemoveQuestion(index)}>Remove Question</button>
              </div>
            ))}
               <br/>
            <button className="AddButton" type="button" onClick={handleAddQuestion}>Add Question</button>
            <br/>
            <button type="submit">Submit Feedback</button>
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
