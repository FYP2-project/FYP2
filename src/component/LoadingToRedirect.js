import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "../css/Loadin.css";
import TopBar from "./staff/TopBar.js";
const LoadingToRedirect = () =>{


    const [count, setCount] = useState(1);
    const navigate = useNavigate();

    useEffect(()=>{
        const interval = setInterval(()=> {
            setCount((currentCount) => --currentCount)
        }, 2000)
        count === 0 && navigate("/")
        return ()=> clearInterval(interval);
    }, [count, navigate])


return(
    <div>
       <TopBar />
<div className="loading">Loading&#8230;</div> 
    </div>




)


}


export default LoadingToRedirect;