import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  ScreenShareOff,
  PhoneOff,
  Maximize2,
  Minimize2
} from 'lucide-react';


import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,

} from "@videosdk.live/react-sdk";

import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEnterClassDetails } from "@/store/classSlice";
import { useDispatch, useSelector } from "react-redux";


const MeetScreen = () => {
  
  const params = useParams()
  const classId = params.classId
  const meetId = params.meetId
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { currentClass } = useSelector((state) => state.class)
  const { token } = useSelector((state) => state.meetSlice);

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth/login");
    dispatch(fetchEnterClassDetails(classId));

  }, [isAuthenticated]);


  //for host findin
  //i have role too in {user} but ok let it be :)
  let isHost = false;
  if (currentClass && currentClass.createdBy === user._id) {
    isHost = true;
  }

  return (
    <div>MeetScreen</div>
  )
}

export default MeetScreen