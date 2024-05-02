import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../../component/staff/SideBar";
import "../../../css/TopBar.css"; 
import "../../../App.css"
import TopBar from "../../../component/staff/TopBar";
import { addEvent } from "../../../redux/action";
import { storage } from "../../../config/firebase-config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import ConfirmationDialog from "../../../component/student/ConfirmationDialog";
import DeleteDialog from "../../../component/DeleteDialog";
import SuccessMessage from "../../../component/SuccessDialog";

const AddNewEvents = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [minimized, setMinimized] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    enddate: "",
    Online: "",
    status: "",
     presenters: [""] ,
    seats:"",
    description: "",
    type: "",
    Faculty:"",
    venue:"",
    link:"",
    image: null,
   
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); 
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);  
  const [perc, setPerc] = useState(0);
  const [file, setFile] = useState(null);

  const toggleMinimized = (isMinimized) => {
    setMinimized(isMinimized);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file type
      const fileType = selectedFile.type;
      if (
        fileType === "image/jpeg" ||
        fileType === "image/png" ||
        fileType === "image/gif"
      ) {
        setFile(selectedFile);
        uploadFile(selectedFile); // Upload file
      } else {
        alert("Only JPG, PNG, and GIF file types are allowed.");
      }
    }
  };

  const uploadFile = (file) => {
    const name = new Date().getTime() + file.name;
    const storageRef = ref(storage, "Events/" + name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setPerc(progress);
      },
      (error) => {
        console.error("Error uploading file:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, image: downloadURL });
        });
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addEvent(formData)); // Dispatch the addEvent action with form data
    // Optionally, you can clear the form fields after submission
    setFormData({
      title: "",
      date: "",
      time: "",
      enddate: "",
      Online: "",
      status: "",
      presenters: [""] ,
      seats:"",
      description: "",
      type: "",
      Faculty:"",
      venue:"",
      link:"",
      image: null,
      
    });
    setFile(null);
    setShowConfirmation(false);
    setShowSuccessMessage(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true); // Show confirmation dialog
  };

  const cancelAddSubmit = () => {
    setShowConfirmation(false); // Hide confirmation dialog if user cancels
  };

  const handleAddPresenter = () => {
    setFormData({ ...formData, presenters: [...formData.presenters, ""] });
  };

  // Function to handle changing presenter input values
  const handlePresenterChange = (index, value) => {
    const newPresenters = [...formData.presenters];
    newPresenters[index] = value;
    setFormData({ ...formData, presenters: newPresenters });
  };
  const handleRemovePresenter = (index) => {
    const newPresenters = [...formData.presenters];
    newPresenters.splice(index, 1);
    setFormData({ ...formData, presenters: newPresenters });
  };

  return (
    <div className="App">
      <TopBar />
      <SideBar onToggleMinimized={toggleMinimized} />
      <div>
        <div className={`content${minimized ? 'minimized' : ''}`}>
      
          <h1>Add New Event</h1>
          <form onSubmit={handleAddSubmit}>
          {formData.image && (
          <img className="EditEventImage" src={formData.image} alt="Uploaded" />
        )}
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
               <input
                  className="AddNewEventInput"
              type="time"
              name="time"
              placeholder="Time"
              value={formData.time}
              onChange={handleChange}
              required
            />
            <h5 className="event-image-info">please enter a date to end the event registration</h5>
             <input
                  className="AddNewEventInput"
              type="date"
              name="enddate"
              placeholder="Date"
              value={formData.enddate}
              onChange={handleChange}
              required
            />
             <select
              id="Online"
              name="Online"
              value={formData.Online}
              onChange={handleChange}
              required
            >
              <option value="">Is the Event Online</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="both">Offline and Online</option>
            </select>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="open">Open</option>
              <option value="close">Close</option>
            </select>
            {formData.presenters.map((presenter, index) => (
              <div style={{display:"flex", flexDirection:"row", flexWrap:"nowrap", alignItems:"flex-start"}} key={index}>
                <br/>
                <input
                 className="AddNewEventInput"
                  type="text"
                  placeholder="Presenters"
                  value={presenter}
                  onChange={(e) => handlePresenterChange(index, e.target.value)}
                />
                <button className="RemoveButton" type="button" onClick={() => handleRemovePresenter(index)}>
                  Remove Presenter
                </button>
                <br/>
              </div>
            ))}
            <br></br>
            <button className="AddButton"  type="button" onClick={handleAddPresenter}>Add More Presenter</button>
            <br></br>
            <input
                  className="AddNewEventInput"
              type="number"
              name="seats"
              placeholder="Available Seats"
              value={formData.seats}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Seminar">Seminar</option>
              <option value="Presentation">Presentation</option>
              <option value="Workshop">Workshop</option>
              <option value="Other">Other</option>
              
            </select>
            <select
              id="Faculty"
              name="Faculty"
              value={formData.Faculty}
              onChange={handleChange}
              required
            >
              <option value="">Select Faculty</option>
              <option value="Faculty of Dentistry">Faculty of Dentistry</option>
              <option value="Faculty of Pharmacy">Faculty of Pharmacy</option>
              <option value="Faculty of Engineering & Computer Science">Faculty of Engineering & Computer Science</option>
              <option value="Faculty of Health Sciences">Faculty of Health Sciences</option>
              <option value="Faculty of Management and Social Sciences">Faculty of Management and Social Sciences</option>
            </select>
             <input
                  className="AddNewEventInput"
              type="text"
              name="venue"
              placeholder="Venue"
              value={formData.venue}
              onChange={handleChange}
              required
            />
              <input
            className="AddNewEventInput"
              type="text"
              name="link"
              placeholder="Link"
              value={formData.link}
              onChange={handleChange}
              
            />
            <h5 className="event-image-info">please use 1:1 aspect ratio image</h5>
            <div>
              <input type="file" onChange={handleImageChange} required/>
            </div>
            {!formData.image ? (
                  <button disabled>Submit</button>
                ) : (
                 <button type="submit" disabled={!formData.image}>Submit</button>
                )}
            
            {perc !== 0 && <p>Upload Progress: {perc}%</p>}
          </form>
        </div>
      </div>
      {showConfirmation && (
            <ConfirmationDialog
              message="Are you sure you want to add this event?"
              onConfirm={handleSubmit}
              onCancel={cancelAddSubmit}
            />
          )}

{showSuccessMessage && (
        <SuccessMessage
          message="Event Added successfully"
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
    </div>
  );
};


export default AddNewEvents;
