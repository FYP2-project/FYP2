import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../component/staff/SideBar";
import "../../css/TopBar.css"; 
import "../../App.css"
import TopBar from "../../component/staff/TopBar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { Link, useNavigate } from "react-router-dom";

const EvaluatePortfolio = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [minimized, setMinimized] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const [selectedDepartment, setSelectedDepartment] = useState(""); // State to store selected department
  const navigate = useNavigate();
  
  const toggleMinimized = (isMinimized) => {
    setMinimized(isMinimized);
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teachersSnapshot = await getDocs(collection(db, "teacher"));
        const teachersData = teachersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTeachers(teachersData);
        setLoading(false); // Set loading to false after fetching all teachers
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    fetchTeachers();
  }, []); // Empty dependency array to fetch data only once

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const filteredTeachers = teachers.filter(teacher => {
    const nameIncludesQuery = teacher.name.toLowerCase().includes(searchQuery.toLowerCase());
    const departmentMatches = selectedDepartment ? teacher.department === selectedDepartment : true;
    return nameIncludesQuery && departmentMatches;
  });
  
  return (
    <div className="App">
      <TopBar />
      <SideBar onToggleMinimized={toggleMinimized} />
      <div>
        <div className={`content${minimized ? "minimized" : ""}`}>
          <h2>Teachers</h2>
          
          {/* Search input */}
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          
       
          <select
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            className="department-select"
          >
            <option value="">All Departments</option>
            <option value="SE">SE</option>
            <option value="NT">NT</option>
            <option value="IT">IT</option>
          </select>
           {loading ? (
             
             <div className="spinner-container">
             <div className="spinner"></div>
           </div>
            ) : (
          <div className="presentation-container">
           
           
          
             { filteredTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="presentation-rectangle"
                  onClick={() => {
                    navigate(`/EvaluatePortfolio/LecturerPortfolio/${teacher.id}`);
                  }}
                >
                  {teacher.image && <img src={teacher.image} alt="Event" style={{borderRadius:"100px", width:"70%", height:"70%"}} />}
                  <p className="presentation-title">{teacher.name}</p>
                </div>
              ))}
            
          </div>)}
        </div>
      </div>
    </div>
  );
};


export default EvaluatePortfolio;
