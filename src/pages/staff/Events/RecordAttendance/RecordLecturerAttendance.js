import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../../../component/staff/SideBar";
import "../../../../css/TopBar.css"; 
import "../../../../App.css"
import TopBar from "../../../../component/staff/TopBar";
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db, storage } from "../../../../config/firebase-config";
import { useParams } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const RecordLecturerAttendance = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [minimized, setMinimized] = useState(true);
  const [users, setUsers] = useState([]);
  const [event, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState("");
  const toggleMinimized = (isMinimized) => {
    setMinimized(isMinimized);
  };

  useEffect(() => {
    const fetchDataAndCopyIds = async () => {
      try {
        // Copy user IDs to Lparticipate
        const teacherCollectionRef = collection(db, "teacher");
        const teacherQuerySnapshot = await getDocs(teacherCollectionRef);
        const userIds = teacherQuerySnapshot.docs.map(doc => doc.id);
        const eventDocRef = doc(db, "Events", id);
        await updateDoc(eventDocRef, { Lparticipate: userIds });
  
        // Fetch event data
        const eventDocSnapshot = await getDoc(eventDocRef);
        if (eventDocSnapshot.exists()) {
          const eventData = eventDocSnapshot.data();
          const Lparticipate = eventData.Lparticipate || [];
          const presenting = eventData.presenting || [];
          const attending = eventData.attending || [];
  
          // Fetch user data based on Lparticipate
          const usersPromises = Lparticipate.map(async (Lparticipant) => {
            const userDocRef = doc(db, "teacher", Lparticipant);
            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
              const userData = userDocSnapshot.data();
              return {
                id: Lparticipant,
                presenting: presenting.includes(Lparticipant),
                attending: attending.includes(Lparticipant),
                ...userData
              };
            }
          });
          setEvents(eventData);
          const usersData = await Promise.all(usersPromises);
          setUsers(usersData.filter((user) => user)); // Remove undefined values
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
  
    fetchDataAndCopyIds();
  }, [id]);
  // Fetch teachers based on selected facility
  useEffect(() => {
    const fetchTeachersByFacility = async () => {
      try {
        let teacherCollectionRef = collection(db, "teacher");
        if (selectedFacility) {
          teacherCollectionRef = query(teacherCollectionRef, where("department", "==", selectedFacility));
        }
        const teacherQuerySnapshot = await getDocs(teacherCollectionRef);
        const teacherData = teacherQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(teacherData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching teachers by department:", error);
        setLoading(false);
      }
    };
    fetchTeachersByFacility();
  }, [selectedFacility]);

  const handleAttendanceChange = async (userId, checked, type) => {
    try {
      const eventDocRef = doc(db, "Events", id);
  
      // Get the current event data
      const eventDocSnapshot = await getDoc(eventDocRef);
      if (eventDocSnapshot.exists()) {
        const eventData = eventDocSnapshot.data();
  
        // Update attendance status based on type
        let updatedUsers = users.map((user) => {
          if (user.id === userId) {
            // If the checkbox is checked, update the type and uncheck the other type
            if (checked) {
              return { ...user, [type]: true, [type === "presenting" ? "attending" : "presenting"]: false };
            } else {
              return { ...user, [type]: false };
            }
          }
          return user;
        });
  
        // Update Firestore document based on the changes
        await updateAttendanceInFirestore(userId, checked, eventData, type);
  
        // Update the local state to reflect the changes
        setUsers(updatedUsers);
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };
  
  const updateAttendanceInFirestore = async (userId, checked, eventData, type) => {
    try {
      const eventDocRef = doc(db, "Events", id);
      const { presenting, attending } = eventData;
  
      // Update the 'Lpresent' and 'Labsent' arrays based on checkbox state changes
      let presentingArray = presenting;
      let attendingArray = attending;
  
      if (checked) {
        if (type === "presenting") {
          presentingArray = arrayUnion(userId);
          attendingArray = arrayRemove(userId);
        } else {
          attendingArray = arrayUnion(userId);
          presentingArray = arrayRemove(userId);
        }
      } else {
        if (type === "presenting") {
          presentingArray = arrayRemove(userId);
        } else {
          attendingArray = arrayRemove(userId);
        }
      }
  
      // Update the document in Firestore
      await updateDoc(eventDocRef, { presenting: presentingArray, attending: attendingArray });
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
            
          <h2>Lecturer Record Attendance</h2>
          
          <br/>
          <select
          value={selectedFacility === null ? "" : selectedFacility}
          onChange={(e) => setSelectedFacility(e.target.value)}
        >
          <option value="">All Department</option>
          <option value="SE">SE</option>
          <option value="NT">NT</option>
          <option value="IT">IT</option>
        </select>
          {loading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              <h3 className="event-title">Event title: {event.title}</h3>
              <div className="RecordAttendanceContainer">
                <ul>
                  {users.map((user) => (
                    <li key={user.id} className="AttendList">
                      <img src={user.image} alt="User" />
                      <p>Email: {user.email}</p>
                      <p>Name: {user.name}</p>
                      <p >
                        <label className="checkbox">
                        Presenting: &nbsp;
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              handleAttendanceChange(user.id, e.target.checked, "presenting")
                            }
                            checked={user.presenting} 
                          />
                        </label>
                      </p>
                      <p >
                        <label className="checkbox">
                        Attending: &nbsp;&nbsp;
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              handleAttendanceChange(user.id, e.target.checked, "attending")
                            }
                            checked={user.attending} 
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
}

export default RecordLecturerAttendance;
