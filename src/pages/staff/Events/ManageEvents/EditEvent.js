import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../../../component/staff/SideBar";
import "../../../../css/TopBar.css"; 
import "../../../../App.css"
import TopBar from "../../../../component/staff/TopBar";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../../config/firebase-config";
import { useNavigate, useParams } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import ConfirmationDialog from "../../../../component/student/ConfirmationDialog";
import DeleteDialog from "../../../../component/DeleteDialog";
import {QRCodeSVG} from 'qrcode.react';
import { deleteEventData, updateEventDetails } from "../../../../redux/action";
import SuccessMessage from "../../../../component/SuccessDialog";
import ErrorDialog from "../../../../component/ErrorDialog";
const EditEvent = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [minimized, setMinimized] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false); 
  const [showDelete, setShowDelete] = useState(false); 
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);  
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);  
  const [showErrorMessage, setShowErrorMessage] = useState(false);  
  const [errorMessage, setErrorMessage] = useState("");
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
  const [file, setFile] = useState(null);
  const [perc, setPerc] = useState(0);
  const [uploading, setUploading] = useState(false); // Track upload state
  const [loading, setLoading] = useState(true);

  const toggleMinimized = (isMinimized) => {
    setMinimized(isMinimized);
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventDocRef = doc(db, "Events", id);
        const eventDocSnapshot = await getDoc(eventDocRef);
        if (eventDocSnapshot.exists()) {
          const eventData = eventDocSnapshot.data();
          setFormData({
            title: eventData.title || "",
            date: eventData.date || "",
            time: eventData.time || "",
            enddate:eventData.enddate || "",
            Online: eventData.Online || "",
            status: eventData.status || "",
            presenters: eventData.presenters || [""],
            seats:eventData.seats || "",
            description: eventData.description || "",
            type: eventData.type || "",
            Faculty:eventData.Faculty || "",
            venue:eventData.venue || "",
            link: eventData.link ||"",
            image: eventData.image || null,
          });
          setLoading(false); 
        } else {
          setShowErrorMessage(true);
        setErrorMessage("Event not found!");
        }
      } catch (error) {
        if (error.code === "permission-denied") {
          setShowErrorMessage(true);
          setErrorMessage("Permission denied. You do not have access to this event.");
        } else {
          setShowErrorMessage(true);
          setErrorMessage("Some error happened!");
        }
      }
    };
    fetchEventData();
  }, [id]);

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
        fileType === "image/png" ||
        fileType === "image/jpeg" ||
        fileType === "image/gif"
      ) {
        setFile(selectedFile);
        startUpload(selectedFile); // Start upload immediately
      } else {
        setShowErrorMessage(true);
        setErrorMessage("Only PNG, JPEG, and GIF file types are allowed.");
      }
    }
  };

  const startUpload = (file) => {
    setUploading(true); // Set uploading state to true
    const name = new Date().getTime() + file.name;
    const storageRef = ref(storage, "Events/" + name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Track upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setPerc(progress);
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        setShowErrorMessage(true);
        setErrorMessage("Error uploading file!");
      },
      () => {
        // Once upload is complete, update formData with image URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, image: downloadURL });
          setUploading(false); // Set uploading state to false
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!uploading) {
        // If not currently uploading, submit the form directly
        submitForm();
      } else {
        console.log("Image is still uploading...");
      }
      setShowSuccessMessage(true);
    } catch (error) {
      setShowErrorMessage(true);
      setErrorMessage("Error handling form submission!");
    }
    setShowConfirmation(false);
    
  };

  const submitForm = async () => {
    try {
      dispatch(updateEventDetails(id, formData));
    } catch (error) {
      setShowErrorMessage(true);
      setErrorMessage("Error updating event details!");
   
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteEventData(id));
      
      setShowDeleteMessage(true);
    } catch (error) {
      setShowErrorMessage(true);
      setErrorMessage("Error deleting event!");
    }
    setShowDelete(false);
  };

  const handleChangeSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true); // Show confirmation dialog
  };

  const cancelChangeSubmit = () => {
    setShowConfirmation(false); // Hide confirmation dialog if user cancels
  };

  const handleDeleteMessage = (e) => {
    e.preventDefault();
    setShowDelete(true); 
  };

  const cancelDeleteMessage = () => {
    setShowDelete(false); 
  };

  const DeleteMessgae = () => {
    setShowDeleteMessage(false);
    if(formData.type === "Other"){
      navigate("/Events/ManageEvents/ManageOtherEvent")
    }
    else if (formData.type === "Workshop"){
      navigate("/Events/ManageEvents/ManageWorkShop")
    }
    else if (formData.type === "Presentation"){
      navigate("/Events/ManageEvents/ManagePresentation")
    }
    else if (formData.type === "Seminar"){
      navigate("/Events/ManageEvents/ManageSeminar")
    }
  };

  const handleDownload = () => {
    const qrCodeSVG = document.querySelector(".QrCode"); // Get the QR code SVG element

    // Create a canvas element
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Create an image element to hold the converted PNG image
    const image = new Image();

    // Set canvas dimensions to match SVG
    canvas.width = qrCodeSVG.width.baseVal.value;
    canvas.height = qrCodeSVG.height.baseVal.value;

    // Convert SVG to a data URL
    const svgData = new XMLSerializer().serializeToString(qrCodeSVG);
    const svgURL = "data:image/svg+xml;base64," + btoa(svgData);

    // Load SVG data into image
    image.onload = () => {
      // Draw SVG image onto canvas
      context.drawImage(image, 0, 0);

      // Convert canvas to PNG data URL
      const pngDataURL = canvas.toDataURL("image/png");

      // Create a download link for PNG
      const downloadLink = document.createElement("a");
      downloadLink.href = pngDataURL;
      downloadLink.download = "qr_code.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Clean up
      document.body.removeChild(downloadLink);
    };

    // Set image source to SVG data URL
    image.src = svgURL;
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
          <h2>Edit Event</h2>
          <form onSubmit={handleChangeSubmit}>
            <div className="container">
              <QRCodeSVG fgColor="#000000" bgColor="#ffffff" onClick={handleDownload} className="QrCode" alt="Download the QR code" value={`https://fyp2-app-525c3.web.app/Student/Events/register/${id}`} width={200} height={200} />
              {formData.image && (
                <img className="EditEventImage" src={formData.image} alt="Uploaded" />
              )}
            </div>
            <input className="AddNewEventInput" type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
            <input className="AddNewEventInput" type="date" name="date" placeholder="Date" value={formData.date} onChange={handleChange} required />
            <input className="AddNewEventInput" type="time" name="time" placeholder="Time" value={formData.time} onChange={handleChange} required />
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
            <select name="Online" value={formData.Online} onChange={handleChange} required>
              <option value="">Is the Event Online</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="both">Offline and Online</option>
            </select>
            <select name="status" value={formData.status} onChange={handleChange} required>
              <option value="">Select Status</option>
              <option value="open">Open</option>
              <option value="close">Close</option>
            </select>
            {formData.presenters.map((presenter, index) => (
              <div style={{display:"flex", flexDirection:"row", flexWrap:"nowrap", alignItems:"flex-start"}} key={index}>
                <br/>
                <input className="AddNewEventInput" type="text" placeholder="Presenters" value={presenter} onChange={(e) => handlePresenterChange(index, e.target.value)} />
                <button className="RemoveButton" type="button" onClick={() => handleRemovePresenter(index)}>Remove Presenter</button>
                <br/>
              </div>
            ))}
            <br/>
            <button className="AddButton"  type="button" onClick={handleAddPresenter}>Add More Presenter</button>
            <br/>
            <input className="AddNewEventInput" type="number" name="seats" placeholder="Available Seats" value={formData.seats} onChange={handleChange} required />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required></textarea>
            <select name="type" value={formData.type} onChange={handleChange} required>
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
            <input className="AddNewEventInput" type="text" name="venue" placeholder="Venue" value={formData.venue} onChange={handleChange} required />
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
              <input type="file" onChange={handleImageChange} />
            </div>
            <button type="submit" disabled={uploading}>Update</button>
            {perc !== 0 && <p>Upload Progress: {perc}%</p>}
            <br/>
            <button className="DeleteButton" onClick={handleDeleteMessage}>Delete Event</button>
          </form>
        </div>
      </div>
      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to change this event?"
          onConfirm={handleSubmit}
          onCancel={cancelChangeSubmit}
        />
      )}
      {showDelete && (
        <ConfirmationDialog
          message="Are you sure you want to delete this event?"
          onConfirm={handleDelete}
          onCancel={cancelDeleteMessage}
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
          message="Event Updated successfully"
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
        {showErrorMessage && (
    <ErrorDialog
      message={errorMessage}
      onClose={() => {
        setShowErrorMessage(false);
        setErrorMessage("");
      }}
    />
  )}
    </div>
  );
};

export default EditEvent;
