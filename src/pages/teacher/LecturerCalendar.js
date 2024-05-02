import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../css/TopBar.css"; 
import "../../App.css"
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { Link } from "react-router-dom";
import LTopBar from "../../component/teacher/LecturerTopBar";
import LSideBar from "../../component/teacher/LecturerSideBar";

const LCalendar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [minimized, setMinimized] = useState(true);
  const [events, setEvents] = useState([]);

  const toggleMinimized = (isMinimized) => {
    setMinimized(isMinimized);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollectionRef = collection(db, "Events");
        const eventsSnapshot = await getDocs(eventsCollectionRef);
        const eventsData = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);



  return (
    <div className="App">
    <LTopBar />
      <LSideBar onToggleMinimized={toggleMinimized} />
      <div className={`content${minimized ? 'minimized' : ''}`}>
        <h2>Calendar</h2>
       
        <style>
          {`
            .calendar-container {
              display: flex;
              justify-content: center;
            }

            .calendar-wrapper {
              width: 100%;
              height: 80vh;
            }
            button {
              padding: 10px 20px;
              background-color: #007bff;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
          }

            .react-calendar{
              width: 100%;
              height: 80vh;
              background-color: #343434;
              color: white;
            }
            .react-calendar__navigation button {
              min-width: 44px;
              background: rgba(49, 63, 98, 0.866);
          }
          a{
            color: #CCFFCC;
          }
          .react-calendar__month-view__days__day--neighboringMonth, .react-calendar__decade-view__years__year--neighboringDecade, .react-calendar__century-view__decades__decade--neighboringCentury {
            color: #757575 !important;
        }
        .react-calendar__month-view__days__day--weekend {
          color: white;
      }
      .react-calendar__tile:enabled:hover {
        background-color: rgb(64,64,64);
    }
    .react-calendar__navigation button:enabled:hover, .react-calendar__navigation button:enabled:focus {
        background-color: rgba(49, 80, 120, 0.866);
    }
    .react-calendar__tile--active:enabled:focus, .react-calendar__tile--active:enabled:hover {
      background: #1087ff !important;
  }
 .react-calendar__tile:enabled:focus {
    background-color: rgb(69, 69, 60);
}




    @media (max-width: 768px) {
        .calendar-wrapper {
          width: 100%;
          height: 50vh;
          font-size: 0.8em;
        }
        .react-calendar{
            width: 100%;
            height: 50vh;
            font-size: 0.8em;
          }
      }
      @media (max-width: 568px) {
        .calendar-wrapper {
          width: 100%;
          height: 40vh;
          font-size: 0.8em;
        }
        .react-calendar{
            width: 100%;
            height: 40vh;
            font-size: 0.8em;
          }
      }
          
          `}
        </style>
        <div className="calendar-container">
          <div className="calendar-wrapper">
            <Calendar
              onChange={(date) => console.log(date)}
              value={new Date()}
              tileContent={({ date }) => {
                const currentDate = new Date(date);
   
                const previousDate = new Date(currentDate);
                previousDate.setDate(previousDate.getDate() + 1);

                const formattedPreviousDate = previousDate.toISOString().slice(0, 10);

                const eventsOnDate = events.filter(event => event.date === formattedPreviousDate && event.status !== "close");
                
                return (
                  <div>
                    {eventsOnDate.map(event => (
                      <p key={event.id}>
                        <Link to={`https://fyp2-app-525c3.web.app/LecturerEvent/EventDetails/${event.id}`}>
                          {event.title}
                        </Link>
                      </p>
                    ))}
                  </div>
                );
              }}
         
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LCalendar;
