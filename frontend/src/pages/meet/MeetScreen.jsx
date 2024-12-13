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
import Spinner from '../../components/common/Spinner'
import { getToken } from "@/store/meet";
import MeetingView from "@/components/meet/MeetingView";




const MeetScreen = () => {
  const params = useParams();
  const classId = params.classId;
  const meetId = params.meetId;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { currentClass } = useSelector((state) => state.class);
  const { token } = useSelector((state) => state.meetSlice); 

  const [meetingId, setMeetingID] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(true);

  useEffect(() => {
    const initMeeting = async () => {
      if (!isAuthenticated) {
        navigate("/auth/login");
        return;
      }

      try {
        // Fetch class details
         dispatch(fetchEnterClassDetails(classId));

        // Fetch token if not already available
        if (!token) {
          await dispatch(getToken()).unwrap();
        }

        // Set meeting ID
        setMeetingID(meetId);
      } catch (error) {
        console.error("Meeting initialization error:", error);
        navigate("/home"); // Or handle error appropriately
      } finally {
        setTokenLoading(false);
      }
    };

    initMeeting();
  }, [isAuthenticated, classId, meetId, dispatch, navigate, token]);

  const onMeetingLeave = () => {
    setMeetingID(null);
    navigate('/home');
  };

  // Determine if user is host
  const isHost = currentClass && currentClass.createdBy === user._id;

  // Comprehensive loading and error handling
  if (tokenLoading) {
    return <Spinner />;
  }

  if (!token || !meetingId) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Unable to join meeting. Please try again.</p>
        <button onClick={() => navigate('/home')}>Go to Home</button>
      </div>
    );
  }

  return (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: user.name,
      }}
      token={token}
    >
      <MeetingView
        meetingId={meetingId} 
        onMeetingLeave={onMeetingLeave} 
      />
    </MeetingProvider>
  );
};

export default MeetScreen;