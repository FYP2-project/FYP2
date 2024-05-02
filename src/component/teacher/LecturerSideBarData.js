import React from 'react'
import { MdAccountCircle } from "react-icons/md";
import { MdEvent } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { VscFeedback } from "react-icons/vsc";
import { LuClipboardCheck } from "react-icons/lu";
import { IoCalendarOutline } from "react-icons/io5";
import { GoFileDirectory } from "react-icons/go";
export const LSideBarData =  [
    {
        title: "Lecturer Events",
        icon: <MdEvent />,
        link: "/LecturerEvent",

    },
    {
        title: "Event Calendar",
        icon: <IoCalendarOutline />,
        link: "/EventCalendar",

    },
    {
        title: "Portfolio",
        icon: <GoFileDirectory />,
        link: "/Portfolio",

    },
]


