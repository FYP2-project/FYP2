import React from 'react'
import { MdAccountCircle } from "react-icons/md";
import { MdEvent } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { VscFeedback } from "react-icons/vsc";
import { LuClipboardCheck } from "react-icons/lu";
export const SideBarData =  [
    {
        title: "Events",
        icon: <MdEvent />,
        link: "/Events",

    },
    {
        title: "Users",
        icon: <FaUsers />,
        link: "/Users",

    },
    {
        title: "FeedBack",
        icon: <VscFeedback />,
        link: "/FeedBack",

    },
    {
        title: "Evaluate Portfolio",
        icon: <LuClipboardCheck />,
        link: "/EvaluatePortfolio",

    }
]


