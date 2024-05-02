import './App.css';
import {BrowserRouter,Routes , Route} from "react-router-dom";
import register from './pages/staff/EvaluatePortfolio.js';
import Login from './pages/login';
import { useDispatch } from "react-redux";
import React, {useEffect} from 'react';
import { auth } from './config/firebase-config';
import { setUser } from './redux/action';
import Register from './pages/staff/EvaluatePortfolio.js';
import StaffRoute from './component/staff/StaffRoute.js';
import TeacherRoute from './component/teacher/TeacherRoute.js';
import NotFound from './pages/notFound';
import Users from './pages/staff/Users.js';
import Events from './pages/staff/Events.js';
import AddFeedBack from './pages/staff/FeedBack.js';
import FeedBack from './pages/staff/FeedBack.js';
import EvaluatePortfolio from './pages/staff/EvaluatePortfolio.js';
import TeacherPage from './pages/teacher/LecturerEvents.js';
import Profile from './pages/staff/profile.js';
import AddNewStaff from './pages/staff/Users/AddNewStaff.js';
import AddNewEvents from './pages/staff/Events/AddNewEvents.js';
import ManageEvents from './pages/staff/Events/ManageEvents.js';
import ManagePresentation from './pages/staff/Events/ManageEvents/ManagePresentation.js';
import EditEvent from './pages/staff/Events/ManageEvents/EditEvent.js';
import AddFeedback from './pages/staff/Feedbacks/AddFeedback.js';
import ManageFeedBack from './pages/staff/Feedbacks/ManageFeedback.js';
import EditFeedback from './pages/staff/Feedbacks/ManageFeedback/EditFeedback.js';
import AddNewStudent from './pages/staff/Users/AddNewStudent.js';
import AddNewTeacher from './pages/staff/Users/AddNewTeacher.js';
import ManageWorkShop from './pages/staff/Events/ManageEvents/ManageWorkshop.js';
import ManageOtherEvent from './pages/staff/Events/ManageEvents/ManageOtherEvent.js';
import StudentRoute from './component/student/StudentRoute.js';
import StudentEvents from './pages/student/studentEvents.js';
import RegisterEvents from './pages/student/StudentEvents/RegisterEvents.js';
import RecordAttendance from './pages/staff/Events/RecordAttendance/RecordAttendance.js';
import EventList from './pages/staff/Events/RecordAttendance/EventList.js';
import StudentProfile from './pages/student/StudentProfile.js';
import FeedbackList from './pages/student/FeedbackList.js';
import GiveFeedback from './pages/student/Feedback/GiveFeedback.js';
import FeedbackAnswerList from './pages/staff/Feedbacks/FeedbackAnswerList.js';
import FeedbackUserList from './pages/staff/Feedbacks/FeedbackAnswer/FeedbackUserList.js';
import MyEvent from './pages/student/MyEvent.js';
import ForgetPassword from './pages/ForgetPassword.js';
import AttendanceType from './pages/staff/Events/AttendanceType.js';
import LecturerAttendance from './pages/staff/Events/RecordAttendance/LecturerAttendance .js';
import RecordLecturerAttendance from './pages/staff/Events/RecordAttendance/RecordLecturerAttendance.js';
import Calendar from 'react-calendar';
import StudentCalendar from './pages/student/Calendar.js';
import LProfile from './pages/teacher/LecturerProfile.js';
import LCalendar from './pages/teacher/LecturerCalendar.js';
import EventDetails from './pages/teacher/EventDetails.js';
import Portfolio from './pages/teacher/Portfolio.js';
import LecturerPortfolio from './pages/staff/Portfoilo/LecturerPortfoilo.js';
import ManageSeminar from './pages/staff/Events/ManageEvents/ManageSeminar.js';

function App() {
const dispatch = useDispatch();

useEffect(()=>{
auth.onAuthStateChanged((authUser)=>{
  if(authUser){
    dispatch(setUser(authUser))
  }
  else{
    dispatch(setUser(null))
  }
})
}, [dispatch])
  return (
    <BrowserRouter>

    <Routes >
      <Route path='/Events' element={<StaffRoute><Events /></StaffRoute>} />
      <Route path='/Events/AddNewEvents' element={<StaffRoute><AddNewEvents /></StaffRoute>} />
      <Route path='/Events/ManageEvents' element={<StaffRoute><ManageEvents /></StaffRoute>} />
      <Route path='/Events/ManageEvents/ManagePresentation' element={<StaffRoute><ManagePresentation /></StaffRoute>} />
      <Route path='/Events/ManageEvents/ManageWorkShop' element={<StaffRoute><ManageWorkShop /></StaffRoute>} />
      <Route path='/Events/ManageEvents/ManageOtherEvent' element={<StaffRoute><ManageOtherEvent /></StaffRoute>} />
      <Route path='/Events/ManageEvents/ManageSeminar' element={<StaffRoute><ManageSeminar /></StaffRoute>} />
      <Route path='/Events/AttendanceType' element={<StaffRoute>< AttendanceType/></StaffRoute>} />
      <Route path='/Events/AttendanceType/Student' element={<StaffRoute>< EventList/></StaffRoute>} />
      <Route path='/Events/AttendanceType/Lecturer' element={<StaffRoute>< LecturerAttendance/></StaffRoute>} />
      <Route path='/Events/AttendanceType/Student/:id' element={<StaffRoute><RecordAttendance /></StaffRoute>} />
      <Route path='/Events/AttendanceType/Lecturer/:id' element={<StaffRoute><RecordLecturerAttendance /></StaffRoute>} />
      <Route path='/Events/ManageEvents/ManagePresentation/EditEvent/:id' element={<StaffRoute><EditEvent /></StaffRoute>} />
      <Route path='/Events/ManageEvents/ManageWorkShop/EditEvent/:id' element={<StaffRoute><EditEvent /></StaffRoute>} />
      <Route path='/Events/ManageEvents/ManageOtherEvent/EditEvent/:id' element={<StaffRoute><EditEvent /></StaffRoute>} />
      <Route path='/Events/ManageEvents/ManageSeminar/EditEvent/:id' element={<StaffRoute><EditEvent /></StaffRoute>} />
      <Route path='/Users' element={<StaffRoute><Users /></StaffRoute>} />
      <Route path='/Users/AddNewStaff' element={<StaffRoute><AddNewStaff /></StaffRoute>} />
      <Route path='/Users/AddNewStudent' element={<StaffRoute><AddNewStudent /></StaffRoute>} />
      <Route path='/Users/AddNewTeacher' element={<StaffRoute><AddNewTeacher /></StaffRoute>} />
      <Route path='/FeedBack' element={<StaffRoute><FeedBack /></StaffRoute>} />
      <Route path='/FeedBack/AddFeedback' element={<StaffRoute><AddFeedback /></StaffRoute>} />
      <Route path='/FeedBack/ManageFeedBack' element={<StaffRoute><ManageFeedBack /></StaffRoute>} />
      <Route path='/FeedBack/FeedbackAnswerList' element={<StaffRoute><FeedbackAnswerList /></StaffRoute>} />
      <Route path='/FeedBack/FeedbackAnswerList/FeedbackUserList/:id' element={<StaffRoute><FeedbackUserList /></StaffRoute>} />
      <Route path='/FeedBack/ManageFeedBack/EditFeedback/:id' element={<StaffRoute><EditFeedback /></StaffRoute>} />
      <Route path='/EvaluatePortfolio' element={<StaffRoute><EvaluatePortfolio /></StaffRoute>} />
      <Route path='/EvaluatePortfolio/LecturerPortfolio/:id' element={<StaffRoute><LecturerPortfolio /></StaffRoute>} />
      <Route path='/StaffProfile' element={<StaffRoute><Profile /></StaffRoute>} />

      <Route path="/" element={<Login />} />

      <Route path="/LecturerEvent" element={<TeacherRoute><TeacherPage /></TeacherRoute>} />
      <Route path="/LecturerProfile" element={<TeacherRoute><LProfile /></TeacherRoute>} />
      <Route path="/EventCalendar" element={<TeacherRoute><LCalendar /></TeacherRoute>} />
      <Route path="/LecturerEvent/EventDetails/:id" element={<TeacherRoute><EventDetails /></TeacherRoute>} />
      <Route path="/Portfolio" element={<TeacherRoute><Portfolio /></TeacherRoute>} />

      <Route path="/Student/Events" element={<StudentRoute><StudentEvents /></StudentRoute>} />
      <Route path="/StudentProfile" element={<StudentRoute><StudentProfile /></StudentRoute>} />
      <Route path="/FeedbackList" element={<StudentRoute><FeedbackList /></StudentRoute>} />
      <Route path="/FeedbackList/GiveFeedback/:id" element={<StudentRoute><GiveFeedback /></StudentRoute>} />
      <Route path="/Student/Events/register/:id" element={<StudentRoute><RegisterEvents /></StudentRoute>} />
      <Route path="/MyEvents" element={<StudentRoute><MyEvent /></StudentRoute>} />
      <Route path="/Calendar" element={<StudentRoute><StudentCalendar /></StudentRoute>} />
      
      <Route path="/notFound" element={<NotFound />} />
      <Route path="/*" element={<NotFound />} />
      <Route path="/ForgetPassword" element={<ForgetPassword />} />
      
    </Routes>

</BrowserRouter>
  
  );
}

export default App;
