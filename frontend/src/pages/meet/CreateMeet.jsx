import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { v1 as uuid } from "uuid";
import { useNavigate } from "react-router";
import { Copy } from "lucide-react";
import MeetCreation from "@/components/meet/MeetCreation";
import { createMeeting, getToken } from "@/services/VideoSdkApi";
import { toast } from 'react-toastify';




const CreateMeet = () => {
  const navigate = useNavigate()
  const [meetId, setMeetId] = useState('')
  const [authToken, setAuthToken] = useState('null');
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!isAuthenticated) navigate("/auth/login");
    
  }, [ isAuthenticated]);

  const joinMeetHandler = async () => {
    setMeetId('')
    navigate(`/join/meet/${meetId}`)
  }
  const createMeetHandler = async () => {
    try {
      const token = await getToken()
      const meetid = await createMeeting({ token })
      setAuthToken(token)

      setMeetId(meetid);

    } catch (error) {
      console.error("Error creating meeting:", error);
    }

    <p>meetId: {meetId}</p>

  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetId).then(
      () => {
        toast.success("copied to clipboard!");
      },
      (err) => {
        console.error("Error copying Meet ID:", err);
      }
    );
  };

  return (
    <div>
      <MeetCreation meetId={meetId} setMeetId={setMeetId} joinMeetHandler={joinMeetHandler} createMeetHandler={createMeetHandler} />
      {meetId && (
        <div className="mt-4 flex-col items-center space-x-2">
          <p className="text-lg font-medium">Meet ID: {meetId}</p>
          <Button
            variant="outline"
            onClick={copyToClipboard}
            className="flex items-center"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
        </div>
      )}
    </div>
  )
};

export default CreateMeet;
