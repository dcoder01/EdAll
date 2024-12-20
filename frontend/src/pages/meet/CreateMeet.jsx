import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v1 as uuid } from "uuid";
import { useNavigate, useParams } from "react-router";
import { Copy } from "lucide-react";
import MeetCreation from "@/components/meet/MeetCreation";
import { createMeeting } from "@/services/VideoSdkApi";
import { getToken } from "@/store/meet";
import { toast } from 'react-toastify';
import { fetchEnterClassDetails } from "@/store/classSlice";




const CreateMeet = () => {
  const navigate = useNavigate()
  const params=useParams();
  const dispatch=useDispatch()
  const [meetId, setMeetId] = useState('')
  const [authToken, setAuthToken] = useState('null');
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const {currentClass}=useSelector((state)=>state.class)

  
  const classId=params.classId;
  useEffect(() => {
    if (!isAuthenticated) navigate("/auth/login");
    dispatch(fetchEnterClassDetails(classId));
    
  }, [ isAuthenticated]);


  const joinMeetHandler = async () => {
    setMeetId('')
    navigate(`/join/meet/${classId}/${meetId}`)
  }
  const createMeetHandler = async () => {
    try {
      
      let token=null;
 
      if (!token) {
        const tokenResult =await dispatch(getToken()).unwrap();
        token=tokenResult.token
        // console.log(token);
        
      }

      if (token) {
        const meetid = await createMeeting({ token });
        setMeetId(meetid);
      }
    } catch (error) {
      // console.error("Error creating meeting:", error);
      toast.error("Failed to create meeting");
    } 
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetId).then(
      () => {
        toast.success("copied to clipboard!");
      },
      (err) => {
        // console.error("Error copying Meet ID:", err);
        toast.error("failed to copy meet Id")
      }
    );
  };

  return (
    <div>
      <MeetCreation currentClass={currentClass} user={user} meetId={meetId} setMeetId={setMeetId} joinMeetHandler={joinMeetHandler} createMeetHandler={createMeetHandler} />
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
