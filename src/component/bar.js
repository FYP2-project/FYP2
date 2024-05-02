// BarChart.js

import React from "react";
import '../css/bar.css';
const BarChart = ({ questionData }) => {
  if (!questionData || questionData.length === 0) {
    return <div></div>;
  }

  return (
    <div>
      AVG of Rating Questions.
      <br/>
      <div className="bar-chart">
        {questionData.map(({ questionNumber, averageRating }, index) => {
          const ratingClass = getRatingClass(averageRating); 
          const percentage = ((averageRating / 5) * 100).toFixed(1); 

        
          const fillClassName = getFillClassName(percentage);

          return (
            <div key={index} className={`rating ${ratingClass}`}>
              <div className="circle">
                <div className="bar" style={{ '--percentage': percentage + '%' }}></div>
                <div className={`fill ${fillClassName}`}></div>
                <div className="percentage">{percentage}%</div>
              </div>
              <small>Question: {parseInt(questionNumber) + 1}</small> 
            </div>
          );
        })}
      </div>
    </div>
  );
};
  
  // Function to determine the rating class based on the average
  const getRatingClass = (average) => {
    if (average >= 4) {
      return "good";
    } else if (average >= 2.5 && average < 4) {
      return "meh";
    } else {
      return "bad";
    }
  };
  
  // Function to determine the fill class based on the percentage
  const getFillClassName = (percentage) => {
    if (percentage >= 75) {
      return "good";
    } else if (percentage >= 50) {
      return "meh";
    } else {
      return "bad";
    }
  };
  
  export default BarChart;