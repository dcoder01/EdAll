import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { v1 as uuid } from "uuid";
import { useNavigate } from "react-router";
import Spinner from "../../components/common/Spinner";
import { X as ContentCopyIcon } from "lucide-react";
import { MediaService } from "../../services/media"; // Import MediaService

const JoinMeetScreen = () => {
  const userVideo = useRef();
  const navigate = useNavigate();

  const [stream, setStream] = useState(null);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [mediaLoading, setMediaLoading] = useState(true);

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const roomId = params.get("roomId") ? params.get("roomId") : uuid();
  const cameFromCreateMeet = !params.get("roomId");

  const mediaService = new MediaService(); // Initialize MediaService

  const setupMediaStream = async () => {
    try {
      console.log("Setting up media stream...");
      const stream = await mediaService.getLocalStream(); // Use MediaService
      setMediaLoading(false);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
      setStream(stream);
    } catch (err) {
      setMediaLoading(false);
      console.error("Error accessing camera: ", err);
      if (err.name === "NotAllowedError") {
        alert("Please allow camera and microphone access in your browser settings.");
      } else if (err.name === "NotFoundError") {
        alert("No media devices found. Please ensure your camera and microphone are connected.");
      } else {
        alert("Error accessing camera: " + err.message);
      }
    }
  };
  useEffect(() => {
    if (!isAuthenticated) {
      return navigate("/auth/login");
    }
   
      setupMediaStream();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [ mediaLoading]);

  const joinMeet = async () => {
    if (!stream) {
      alert("Stream not initialized.");
      return;
    }
    stream.getVideoTracks()[0].enabled = false;
    stream.getAudioTracks()[0].enabled = false;
    await stream.getTracks().forEach((track) => track.stop());
    navigate(`/join/meet/${roomId}`);
  };

  const callEnd = async () => {
    stream.getVideoTracks()[0].enabled = false;
    stream.getAudioTracks()[0].enabled = false;
    await stream.getTracks().forEach((track) => track.stop());
    return navigate("/home");
  };

  return (
    <div className="flex flex-col items-center mt-8">
      {cameFromCreateMeet && (
        <div className="border border-green-400 bg-green-100 p-4 mb-4 flex flex-col items-center">
          <div>
            <span>Share meet id for others to join: </span>
            <span className="font-semibold">
              <span className="mr-2">{roomId}</span>

              <span
                onClick={() => navigator.clipboard.writeText(roomId)}
                className="cursor-pointer"
              >
                <ContentCopyIcon />{" "}
              </span>
            </span>
          </div>
          <p>OR</p>
          <div>
            <span>Copy link: </span>
            <span className="font-semibold">
              <span
                onClick={() =>
                  navigator.clipboard.writeText(
                    `http://localhost:4000/join/meet?roomId=${roomId}`
                  )
                }
                className="cursor-pointer"
              >
                <ContentCopyIcon />{" "}
              </span>
            </span>
          </div>
        </div>
      )}
      {mediaLoading ? (
        <Spinner />
      ) : (
        <video
          width="384px"
          height="384px"
          className="video-ref rounded-lg border border-black"
          src=""
          ref={userVideo}
          autoPlay
          muted
        ></video>
      )}

      <div className="bg-gray-200 my-8 w-1/3 h-20 flex justify-evenly items-center rounded mx-auto shadow-lg sm:w-full">
        <Button color="green" ripple="light" onClick={joinMeet}>
          Join
        </Button>
        <Button color="red" ripple="light" onClick={callEnd}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default JoinMeetScreen;
