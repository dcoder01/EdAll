import React, { useMemo } from 'react'
import {
    MeetingProvider,
    MeetingConsumer,
    useMeeting,
    useParticipant,

} from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
const PresenterView = ({ presenterId }) => {
    const { screenShareStream, screenShareOn } = useParticipant(presenterId);

   
    const mediaStream = useMemo(() => {
        if (screenShareOn && screenShareStream) {
            const mediaStream = new MediaStream();
            mediaStream.addTrack(screenShareStream.track);
            return mediaStream;
        }
    }, [screenShareStream, screenShareOn]);

    return (
        <>
            
            <ReactPlayer
               
                playsinline 
                playIcon={<></>}
                
                pip={false}
                light={false}
                controls={false}
                muted={true}
                playing={true}
               
                url={mediaStream} 
               
                height={"100%"}
                width={"100%"}
                onError={(err) => {
                    console.log(err, "presenter video error");
                }}
            />
        </>
    );
}

export default PresenterView