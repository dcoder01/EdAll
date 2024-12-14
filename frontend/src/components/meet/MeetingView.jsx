import React, { useState } from 'react'
import {

    useMeeting,


} from "@videosdk.live/react-sdk";
import PresenterView from './PresenterView';
import Spinner from '../../components/common/Spinner'
import Controls from './Controls';
import ParticipantView from './ParticipantView';
import { toast} from 'react-toastify';
const MeetingView = (props) => {
    const [joined, setJoined] = useState(null);
    const { join, participants, presenterId } = useMeeting({
        onMeetingJoined: () => {
            setJoined("JOINED");
            // console.log("Meeting joined successfully");
            toast.success("meeting joined successfully!")
        },
        onMeetingLeft: () => {
            props.onMeetingLeave();
        },
        onError: (error) => {
            // console.error("Meeting join error:", error);
            toast.error("Meeting join error")
            setJoined("ERROR");
        }
    });

    const joinMeeting = () => {
        try {
            setJoined("JOINING");
            join();
        } catch (error) {
            // console.error("Failed to join meeting:", error);
            toast.error("Failed to join meeting")
            setJoined("ERROR");
        }
    };

    return (
        <div className="h-screen flex flex-col">
            {joined === "JOINED" ? (
                <div className="flex-grow flex flex-col">
                  
                    {presenterId && (
                        <div className="w-full h-1/4 mb-4">
                            <PresenterView presenterId={presenterId} />
                        </div>
                    )}

                  
                    <div 
                        className="grid gap-4 p-4 flex-grow overflow-auto"
                        style={{
                            gridTemplateColumns: `repeat(${
                                participants.size <= 4 ? participants.size : 4
                            }, minmax(0, 1fr))`,
                            gridAutoRows: 'minmax(200px, 1fr)'
                        }}
                    >
                        {[...participants.keys()].map((participantId) => (
                            <ParticipantView
                                participantId={participantId}
                                key={participantId}
                            />
                        ))}
                    </div>

                  
                    <Controls />
                </div>
            ) : joined === "JOINING" ? (
                <div className="flex-grow flex items-center justify-center">
                    <Spinner />
                </div>
            ) : joined === "ERROR" ? (
                <div className="flex-grow flex flex-col items-center justify-center">
                    <p className="text-red-500 mb-4">Failed to join meeting</p>
                    <button 
                        onClick={joinMeeting}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Retry Join
                    </button>
                </div>
            ) : (
                <div className="flex-grow flex items-center justify-center">
                    <button 
                        onClick={joinMeeting}
                        className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
                    >
                        Join Meeting
                    </button>
                </div>
            )}
        </div>
    );
};

export default MeetingView;