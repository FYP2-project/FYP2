import * as types from "./actionType";
import {auth, createUserWithEmailAndPassword, db, signInWithEmailAndPassword, signOut} from "../config/firebase-config"
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Navigate, useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { AES, enc } from 'crypto-js';


const loginStart = () => ({
    type: types.LOGIN_START,
})
const loginSuccess = (user) => ({
    type: types.LOGIN_SUCCESS,
    payload: user,
})
const loginFail = (error) => ({
    type: types.LOGIN_FAIL,
    payload: error, 
})


const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY;

// Function to encrypt data
const encryptData = (data) => {
  return AES.encrypt(JSON.stringify(data), encryptionKey).toString();
};

// Function to decrypt data
export const decryptData = (encryptedData) => {
  if (encryptedData) {
    try {
      const bytes = AES.decrypt(encryptedData, encryptionKey);
      return JSON.parse(bytes.toString(enc.Utf8));
    } catch (error) {
      console.error("Error decrypting data:", error);
      // Clear the invalid data from localStorage
      localStorage.removeItem("user");
      return null;
    }
  }
  return null;
};

// Action creator to initiate login
export const loginInitiate = (email, password) => {
  return async function (dispatch) {
    dispatch(loginStart());
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, "staff", user.uid);
      const userDocRefT = doc(db, "teacher", user.uid);
      const userDocRefS = doc(db, "student", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      const userDocSnapshotTeacher = await getDoc(userDocRefT);
      const userDocSnapshotStudent = await getDoc(userDocRefS);
      if (userDocSnapshot.exists() || userDocSnapshotTeacher.exists() || userDocSnapshotStudent.exists()) {
        // Save encrypted user data to localStorage
        localStorage.setItem("user", encryptData(user));
        dispatch(loginSuccess(user));
      } else {
        dispatch(logoutInitiate());
        dispatch(loginFail("User does not have access to log in."));
      }
    } catch (error) {
      dispatch(loginFail(error.message));
    }
  };
};



//Logot


const logoutStart = () => ({
    type: types.LOGOUT_START,
})
const logoutSuccess = (user) => ({
    type: types.LOGOUT_SUCCESS,

})
const logoutFail = (error) => ({
    type: types.LOGOUT_FAIL,
    payload: error, 
})

export const logoutInitiate = () => {
    return async function (dispatch) {
        dispatch(logoutStart());
        try {
            // Remove user data from localStorage
            localStorage.removeItem("user");
            localStorage.removeItem("newUser");
            await signOut(auth);
            dispatch(logoutSuccess());
        } catch (error) {
            dispatch(logoutFail(error.message));
        }
    };
};



// setuser

export const setUser = () => {
    const user = decryptData(localStorage.getItem("user"));
    return {
        type: types.SET_USER,
        payload: user,
    };
};


//Add New Staff

const addStaffStart = () => ({
    type: types.ADD_STAFF_START,
  });
  
  const addStaffSuccess = () => ({
    type: types.ADD_STAFF_SUCCESS,
  });
  
  const addStaffFail = (error) => ({
    type: types.ADD_STAFF_FAIL,
    payload: error,
  });



  export const addNewStaff = (email,name, password) => {
    return async function (dispatch) {
        dispatch(addStaffStart());
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            const staffDocRef = doc(db, "staff", user.uid);
            // Set default image URL
            const defaultImageURL = "https://firebasestorage.googleapis.com/v0/b/fyp2-app-525c3.appspot.com/o/staff%2Fprofile.png?alt=media&token=5f5a57a4-2205-4d2f-9a21-c9e9b3038deb";
            await setDoc(staffDocRef, {
                email: email,
                name: name,
                image: defaultImageURL, // Set default image URL here
                // You can add more fields here as needed
            });
            // Save user data to localStorage
            localStorage.setItem("newUser", encryptData(user));
            dispatch(addStaffSuccess());
            console.log("New staff member added successfully!");
        } catch (error) {
            dispatch(addStaffFail(error.message));
            console.error("Error adding new staff member:", error);
        }
    };
};


//Add New Student

const addStudentStart = () => ({
  type: types.ADD_STAFF_START,
});

const addStudentSuccess = () => ({
  type: types.ADD_STAFF_SUCCESS,
});

const addStudentFail = (error) => ({
  type: types.ADD_STAFF_FAIL,
  payload: error,
});



export const addNewStudent = (email, name, password) => {
  return async function (dispatch) {
      dispatch(addStudentStart());
      try {
          const { user } = await createUserWithEmailAndPassword(auth, email, password);
          const staffDocRef = doc(db, "student", user.uid);
          // Set default image URL
          const defaultImageURL = "https://firebasestorage.googleapis.com/v0/b/fyp2-app-525c3.appspot.com/o/staff%2Fprofile.png?alt=media&token=5f5a57a4-2205-4d2f-9a21-c9e9b3038deb";
          await setDoc(staffDocRef, {
              email: email,
              name: name,
              image: defaultImageURL, // Set default image URL here
              // You can add more fields here as needed
          });
          // Save user data to localStorage
          localStorage.setItem("newUser", encryptData(user));
          dispatch(addStudentSuccess());
          console.log("New staff member added successfully!");
      } catch (error) {
          dispatch(addStudentFail(error.message));
          console.error("Error adding new staff member:", error);
      }
  };
};





//Add New Teacher

const addTeacherStart = () => ({
  type: types.ADD_TEACHER_START,
});

const addTeacherSuccess = () => ({
  type: types.ADD_TEACHER_SUCCESS,
});

const addTeacherFail = (error) => ({
  type: types.ADD_TEACHER_FAIL,
  payload: error,
});



export const addNewTeacher = (email,name,scientifictitle,department, password) => {
  return async function (dispatch) {
      dispatch(addTeacherStart());
      try {
          const { user } = await createUserWithEmailAndPassword(auth, email, password);
          const staffDocRef = doc(db, "teacher", user.uid);
          // Set default image URL
          const defaultImageURL = "https://firebasestorage.googleapis.com/v0/b/fyp2-app-525c3.appspot.com/o/staff%2Fprofile.png?alt=media&token=5f5a57a4-2205-4d2f-9a21-c9e9b3038deb";
          await setDoc(staffDocRef, {
              email: email,
              name: name,
              scientifictitle: scientifictitle,
              department:department,
              image: defaultImageURL, // Set default image URL here
              // You can add more fields here as needed
          });
          // Save user data to localStorage
          localStorage.setItem("newUser", encryptData(user));
          dispatch(addTeacherSuccess());
          console.log("New staff member added successfully!");
      } catch (error) {
          dispatch(addTeacherFail(error.message));
          console.error("Error adding new staff member:", error);
      }
  };
};

//Events


const addEventStart = () => ({
    type: types.ADD_EVENT_START,
  });
  
  const addEventSuccess = () => ({
    type: types.ADD_EVENT_SUCCESS,
  });
  
  const addEventFail = (error) => ({
    type: types.ADD_EVENT_FAIL,
    payload: error,
  });
  
  export const addEvent = (eventData) => {
    return async function (dispatch) {
      try {
        const eventsCollectionRef = collection(db, "Events"); // Reference to the events collection
        await addDoc(eventsCollectionRef, eventData); // Add a new document with a random ID
        console.log("Event added successfully!");
      } catch (error) {
        console.error("Error adding event:", error);
      }
    };
  };

// Action creator to update event details
export const updateEventDetails = (eventId, eventData) => {
  return async function (dispatch) {
    try {
      const eventDocRef = doc(db, "Events", eventId); 
      await updateDoc(eventDocRef, eventData);
      console.log("Event details updated successfully");
      dispatch({ type: types.UPDATE_EVENT_SUCCESS, payload: eventData });
    } catch (error) {
      console.error("Error updating event details:", error);
      dispatch({ type: types.UPDATE_EVENT_FAIL, payload: error.message });
    }
  };
};


// Action creator to delete event
export const deleteEventData = (eventId) => {
  return async function (dispatch) {
    try {
      const eventDocRef = doc(db, "Events", eventId);
      await deleteDoc(eventDocRef);
      console.log("Event deleted successfully");
      dispatch({ type: types.DELETE_EVENT_SUCCESS });
    } catch (error) {
      console.error("Error deleting event:", error);
      dispatch({ type: types.DELETE_EVENT_FAIL, payload: error.message });
    }
  };
};



export const registerEventRequest = () => ({
  type: types.REGISTER_EVENT_REQUEST,
});

export const registerEventSuccess = () => ({
  type: types.REGISTER_EVENT_SUCCESS,
});

export const registerEventFailure = (error) => ({
  type: types.REGISTER_EVENT_FAILURE,
  payload: error,
});

export const registerEvent = (eventId, currentUser) => {
  return async (dispatch) => {
    dispatch(registerEventRequest());

    try {
      const eventDocRef = doc(db, 'Events', eventId);
      await updateDoc(eventDocRef, {
        participate: arrayUnion({
          email: currentUser.email,
          uid: currentUser.uid,
        }),
      });
      dispatch(registerEventSuccess());
    } catch (error) {
      dispatch(registerEventFailure(error.message));
    }
  };
};



  //Feedback

  export const addFeedback = (feedbackData) => {
    return async function (dispatch) {
      try {
        const feedbackCollectionRef = collection(db, "feedback"); // Reference to the feedback collection
        await addDoc(feedbackCollectionRef, feedbackData); // Add a new document with feedback data
        console.log("Feedback added successfully!");
      } catch (error) {
        console.error("Error adding feedback:", error);
      }
    };
  };
  
  export const updateFeedback = (feedbackId, feedbackData) => {
    return async function (dispatch) {
      try {
        const feedbackDocRef = doc(db, "feedback", feedbackId);
        await updateDoc(feedbackDocRef, feedbackData);
        dispatch({ type: types.UPDATE_FEEDBACK_SUCCESS, payload: feedbackData });
      } catch (error) {
        dispatch({ type: types.UPDATE_FEEDBACK_FAIL, payload: error.message });
      }
    };
  };
  
  export const deleteFeedback = (feedbackId) => {
    return async function (dispatch) {
      try {
        const feedbackDocRef = doc(db, "feedback", feedbackId);
        await deleteDoc(feedbackDocRef);
        dispatch({ type: types.DELETE_FEEDBACK_SUCCESS, payload: feedbackId });
      } catch (error) {
        dispatch({ type: types.DELETE_FEEDBACK_FAIL, payload: error.message });
      }
    };
  };

  


  //profile


  export const updateStaffProfile = (userId, userData) => {
    return async (dispatch) => {
      dispatch({ type: types.UPDATE_PROFILE_START});
  
      try {
        const userDocRef = doc(db, "staff", userId);
        await updateDoc(userDocRef, userData);
        dispatch({ type: types.UPDATE_PROFILE_SUCCESS});
      } catch (error) {
        dispatch({ type: types.UPDATE_PROFILE_FAIL, payload: error.message });
      }
    };
  };

  export const updateStudentProfile = (userId, userData) => {
    return async (dispatch) => {
      dispatch({ type: types.UPDATE_PROFILE_START});
  
      try {
        const userDocRef = doc(db, "student", userId);
        await updateDoc(userDocRef, userData);
        dispatch({ type: types.UPDATE_PROFILE_SUCCESS});
      } catch (error) {
        dispatch({ type: types.UPDATE_PROFILE_FAIL, payload: error.message });
      }
    };
  };

  export const updateLecturerProfile = (userId, userData) => {
    return async (dispatch) => {
      dispatch({ type: types.UPDATE_PROFILE_START});
  
      try {
        const userDocRef = doc(db, "teacher", userId);
        await updateDoc(userDocRef, userData);
        dispatch({ type: types.UPDATE_PROFILE_SUCCESS});
      } catch (error) {
        dispatch({ type: types.UPDATE_PROFILE_FAIL, payload: error.message });
      }
    };
  };



  //Password Reset

  export const sendPasswordResetEmailRequest = () => ({
    type: types.SEND_PASSWORD_RESET_EMAIL_REQUEST,
  });
  
  export const sendPasswordResetEmailSuccess = () => ({
    type: types.SEND_PASSWORD_RESET_EMAIL_SUCCESS,
  });
  
  export const sendPasswordResetEmailFailure = (error) => ({
    type: types.SEND_PASSWORD_RESET_EMAIL_FAILURE,
    payload: error,
  });
  
  export const sendResetPasswordEmail = (email) => {
    return async (dispatch) => {
      dispatch(sendPasswordResetEmailRequest());
  
      try {
        await sendPasswordResetEmail(auth, email);
        dispatch(sendPasswordResetEmailSuccess());
      } catch (error) {
        dispatch(sendPasswordResetEmailFailure(error.message));
      }
    };
  };