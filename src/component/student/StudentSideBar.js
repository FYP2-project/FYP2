import React, { useState } from 'react';
import '../../css/sideBar.css';
import { StudnetSideBarData } from './StudnetSideBarData';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function StudentSideBar({ onToggleMinimized }) {
  const [minimized, setMinimized] = useState(true);
const navigate = useNavigate();
  const toggleMinimized = () => {
    setMinimized(!minimized);
    onToggleMinimized(!minimized);
  };
  const handleNavigation = (link) => {
    navigate(link);
  };
  return (
    <div className={`SideBarComponent ${minimized ? 'minimized' : ''}`}>
      <div className='SideBar'>
        <div className='toggleButton' onClick={toggleMinimized}>
          {minimized ? <FaBars /> : <FaTimes />}
        </div>
        <ul className='SideBarList'>
          {StudnetSideBarData.map((val, key) => {
            return (
              <li className='row' id={window.location.pathname === val.link ? "active" : ""} key={key} onClick={() => handleNavigation(val.link)} title={val.title} >
               <div className='icon'>{val.icon}</div>
                <div className='title'>{val.title}</div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
}

export default StudentSideBar;
