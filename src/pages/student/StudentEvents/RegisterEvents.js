import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../css/TopBar.css"; 
import "../../../App.css"
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../../config/firebase-config";
import StudentTopBar from "../../../component/student/StudnetTopBar";
import StudentSideBar from "../../../component/student/StudentSideBar";
import ConfirmationDialog from "../../../component/student/ConfirmationDialog";
import emailjs from '@emailjs/browser';
import {QRCodeSVG} from 'qrcode.react';
import { registerEvent } from "../../../redux/action";
import SuccessMessage from "../../../component/SuccessDialog";
const RegisterEvents = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [minimized, setMinimized] = useState(true);
  const [eventDetails, setEventDetails] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); 
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);  
  const { id } = useParams();
  const currentDate = new Date().toISOString().split('T')[0];
  const toggleMinimized = (isMinimized) => {
    setMinimized(isMinimized);
  };

  useEffect(() => {
    const eventDocRef = doc(db, "Events", id);
    const unsubscribe = onSnapshot(eventDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const eventData = docSnapshot.data();
        setEventDetails(eventData);

        
        const registeredUsers = eventData.participate ? eventData.participate.length : 0;
        const remainingSeats = eventData.seats - registeredUsers;

        
        setEventDetails(prevState => ({
          ...prevState,
          remainingSeats: remainingSeats >= 0 ? remainingSeats : 0
        }));

        
        if (eventData.participate && eventData.participate.some(user => user.uid === currentUser.uid)) {
          setIsRegistered(true);
        }
      } else {
        console.error("Event details not found");
      }
    });

    return () => unsubscribe();
  }, [id, currentUser.uid]);

  const handleRegister = () => {
    setShowConfirmation(true);
  };

  const confirmRegistration = async () => {
    try {
      const eventDocRef = doc(db, "Events", id);

      if (eventDetails.remainingSeats > 0) {
        dispatch(registerEvent(id, currentUser));
        sendEmail();
        console.log("Registration successful");
        setIsRegistered(true);
        setShowConfirmation(false);
        setShowSuccessMessage(true);
      } else {
       
        cancelRegistration();
      }
    } catch (error) {
      console.error("Error registering for event:", error);
    }
  };

  const cancelRegistration = () => {
    setShowConfirmation(false); 
  };

  const sendEmail = () => {
    const templateParams = {
      to_UserEmail: currentUser.email,
      eventTitle: eventDetails.title,
      eventDate: eventDetails.date,
      eventTime: eventDetails.time,
      Link: eventDetails.link,
    };

    
    emailjs.send(process.env.REACT_APP_RESETEMAIL_SERVICE_ID, process.env.REACT_APP_RESETEMAIL_TEMPLATE_ID, templateParams, process.env.REACT_APP_RESETEMAIL_PUBLIC_KEY)
      .then((response) => {
        console.log('Email sent successfully:', response);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  };

const handlelink = () => {
  window.open(eventDetails.link, '_blank');
}
  const isEventDatePassed = eventDetails && currentDate > eventDetails.enddate;

  return (
    <div className="App">
       <StudentTopBar />
       <StudentSideBar onToggleMinimized={toggleMinimized} />
       <div>
        <div className={`content${minimized ? 'minimized' : ''}`}>
          <h2>Register for Event</h2>
         
          {eventDetails ? (
            <>
              {eventDetails.image && <img className="EventImage" src={eventDetails.image} alt="Presentation" />}
              {isRegistered ? (
  eventDetails.link && eventDetails.link.trim() !== "" ? (
    <QRCodeSVG onClick={handlelink} className="StudentEventQrCode" alt="Download the QR code" value={`${eventDetails.link}`} width={200} height={200} />
  ) : (
    <br/>
  )
) : (
  <br/>
)}
              
              <div className="event-details">
             
                <h3 className="event-title">{eventDetails.title}</h3>
                <div className="event-details-1">
                <p>&nbsp;&nbsp;<strong>Date: </strong>{eventDetails.date} &nbsp;&nbsp;</p>
                <p><strong>Time: </strong>{eventDetails.time} &nbsp;&nbsp;</p>
                <p><strong>Available Seats:</strong> {eventDetails.seats} &nbsp;&nbsp;</p>
                <p><strong>Presenter: </strong>{eventDetails.presenters && eventDetails.presenters.length > 0 ? eventDetails.presenters.map(presenter => presenter.charAt(0).toUpperCase() + presenter.slice(1)).join(", ") : "None"} &nbsp;&nbsp;</p>
                <p><strong>Venue:</strong> {eventDetails.venue === "" ? "none" : eventDetails.venue } &nbsp;&nbsp;</p>
                <p><strong>Faculty:</strong> {eventDetails.Faculty} &nbsp;&nbsp;</p>
                <p><strong>Remaining Seats:</strong> {eventDetails.remainingSeats} &nbsp;&nbsp;</p>
                <p><strong>Is event online:</strong> {eventDetails.Online === "both" ? "Online and Offline" : eventDetails.Online} &nbsp;&nbsp;</p>
                <p><strong>Description:</strong> {eventDetails.description} &nbsp;&nbsp;</p>
               
                </div> 
                <br/>
                <p style={{color:"red"}}>Please be aware that the event will no longer be available to register after: {eventDetails.enddate} 11:59 PM</p>
              {isRegistered ? (
  eventDetails.link && eventDetails.link.trim() !== "" ? (
    <p style={{color:"#e4b500"}}>If you can't scan the Qr Code, please click on the QR Code</p>
  ) : (
    <br/>
  )
) : (
  <br/>
)}
                <br/>
                {isRegistered ? (
                  <button disabled>You are already registered for this event.</button>
                ) : eventDetails.remainingSeats === 0 ? (
                  <button disabled>No remaining seats</button>
                ): isEventDatePassed ? (
                  <button disabled>The event date has passed</button>
                ) : (
                  <button onClick={handleRegister} disabled={isRegistered || eventDetails.status === "close"}>
                    Register
                  </button>
                )}
              </div>
            </>
          ) : (
            <p>Loading event details...</p>
          )}

         
        </div>
      </div>
       {showConfirmation && (
            <ConfirmationDialog
              message="Are you sure you want to register for this event?"
              onConfirm={eventDetails.remainingSeats > 0 ? confirmRegistration : cancelRegistration} 
              onCancel={cancelRegistration}
            />
          )}

{showSuccessMessage && (
        <SuccessMessage
          message="You have registered successfully."
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
    </div>
  );
};
export default RegisterEvents;
