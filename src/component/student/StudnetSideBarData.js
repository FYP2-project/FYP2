import React from 'react'
import { MdAccountCircle } from "react-icons/md";
import { MdEvent } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { VscFeedback } from "react-icons/vsc";
import { LuClipboardCheck } from "react-icons/lu";
import { MdEventAvailable } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
export const StudnetSideBarData =  [
    {
        title: "Student Events",
        icon: <MdEvent />,
        link: "/Student/Events",

    },
    {
        title: "Feedback",
        icon: <VscFeedback />,
        
        link: "/FeedbackList",

    },
    {
        title: "Calendar",
        icon: <IoCalendarOutline />,
        
        link: "/Calendar",

    },
    {
        title: "My Events",
        icon: <MdEventAvailable />,
        link: "/MyEvents",

    },
 
]


