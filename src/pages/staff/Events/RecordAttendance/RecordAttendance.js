import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../../../component/staff/SideBar";
import "../../../../css/TopBar.css"; 
import "../../../../App.css"
import TopBar from "../../../../component/staff/TopBar";
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../../config/firebase-config";
import { useParams } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const RecordAttendance = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [minimized, setMinimized] = useState(true);
  const [users, setUsers] = useState([]);
  const [event, setEvents] = useState([]);
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
          const participate = eventData.participate || [];
          const present = eventData.present || [];
          const absent = eventData.absent || [];

          const usersPromises = participate.map(async (participant) => {
            const userDocRef = doc(db, "student", participant.uid);
            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
              return { id: participant.uid, present: present.includes(participant.uid), absent: absent.includes(participant.uid), ...userDocSnapshot.data() };
            }
          });
          setEvents(eventData)
          const usersData = await Promise.all(usersPromises);
          setUsers(usersData.filter((user) => user)); 
          setLoading(false);
        } else {
          console.error("Event not found");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id]);

  const handleAttendanceChange = async (userId, checked, type) => {
    try {
      const eventDocRef = doc(db, "Events", id);
  
      
      const eventDocSnapshot = await getDoc(eventDocRef);
      if (eventDocSnapshot.exists()) {
        const eventData = eventDocSnapshot.data();
  
        
        let updatedUsers = users.map((user) => {
          if (user.id === userId) {
            
            if (checked) {
              return { ...user, [type]: true, [type === "present" ? "absent" : "present"]: false };
            } else {
              return { ...user, [type]: false };
            }
          }
          return user;
        });
  
        
        await updateAttendanceInFirestore(userId, checked, eventData, type);
  
        
        setUsers(updatedUsers);
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };
  
  const updateAttendanceInFirestore = async (userId, checked, eventData, type) => {
    try {
      const eventDocRef = doc(db, "Events", id);
      const { present, absent } = eventData;
  
      
      let presentArray = present;
      let absentArray = absent;
  
      if (checked) {
        if (type === "present") {
          presentArray = arrayUnion(userId);
          absentArray = arrayRemove(userId);
        } else {
          absentArray = arrayUnion(userId);
          presentArray = arrayRemove(userId);
        }
      } else {
        if (type === "present") {
          presentArray = arrayRemove(userId);
        } else {
          absentArray = arrayRemove(userId);
        }
      }
  
      
      await updateDoc(eventDocRef, { present: presentArray, absent: absentArray });
    } catch (error) {
      console.error("Error updating attendance in Firestore:", error);
    }
  };
  

  return (
    <div className="App">
    <TopBar />
    <SideBar onToggleMinimized={toggleMinimized} />
    <div>
      <div className={`content${minimized ? "minimized" : ""}`}>
        <h2>Student Record Attendance</h2>
     
        {loading ? (
          <div className="spinner-container">
          <div className="spinner"></div>
        </div>
        ) : (
          <>   <h3 className="event-title">Event title: {event.title}</h3>
            <div className="RecordAttendanceContainer">
            
            <ul>
              {users.map((user) => (
                <li key={user.id} className="AttendList">
                  <img src={user.image} alt="User" />
                 <p>Email: {user.email}</p>
                  <p>Name: {user.name}</p>
                  <p >
                  <label className="checkbox">
                    Present: &nbsp;
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleAttendanceChange(user.id, e.target.checked, "present")
                      }
                      checked={user.present} 
                    />
                  </label>
                  </p>
                  <p >
                  <label className="checkbox">
                    Absent: &nbsp;&nbsp;
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleAttendanceChange(user.id, e.target.checked, "absent")
                      }
                      checked={user.absent} 
                    />
                  </label>
                  </p>
                </li>
              ))}
            </ul>
          </div>
          </>
        
        )}
      </div>
    </div>
  </div>
  );
};

export default RecordAttendance;
