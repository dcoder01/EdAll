import React, { useState } from 'react';
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
import { useMeeting } from "@videosdk.live/react-sdk";


const Controls = () => {

    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullScreen(true);
        } else {
            document.exitFullscreen();
            setIsFullScreen(false);
        }
    };
    const {
        leave,
        toggleMic,
        toggleWebcam,
        toggleScreenShare,
        localScreenShareOn ,
        localMicOn,
        localWebcamOn
    } = useMeeting();




    return (
        
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm p-3 rounded-3xl flex justify-center items-center space-x-4 shadow-lg">
                     
            <button
                onClick={()=>toggleMic()}
                className={`p-3 rounded-full transition-colors ${localMicOn
                        ? 'bg-slate-950 hover:bg-slate-700 text-white'
                        : 'bg-gray-700 hover:bg-slate-950 text-white'
                    }`}
                title={localMicOn ? "Mute Microphone" : "Unmute Microphone"}
            >
                {localMicOn ? <Mic size={24} /> : <MicOff size={24} />}
            </button>

            {/* Camera Toggle */}
            <button
                onClick={()=> toggleWebcam()}
                className={`p-3 rounded-full transition-colors ${localWebcamOn
                        ? 'bg-slate-950 hover:bg-slate-700 text-white'
                        : 'bg-gray-700 hover:bg-slate-950 text-white'
                    }`}
                title={localWebcamOn ? "Turn Off Camera" : "Turn On Camera"}
            >
                {localWebcamOn ? <Video size={24} /> : <VideoOff size={24} />}
            </button>

          
            <button
               onClick={() => toggleScreenShare()}
                className={`p-3 rounded-full transition-colors ${localScreenShareOn 
                        ? 'bg-slate-950 hover:bg-slate-700 text-white'
                        : 'bg-gray-700 hover:bg-slate-950 text-white'
                    }`}
                title={localScreenShareOn  ? "Stop Screen Share" : "Start Screen Share"}
            >
                {localScreenShareOn  ? <ScreenShareOff size={24} /> : <ScreenShare size={24} />}
            </button>

            
            <button
                onClick={()=> leave()}
                className="p-3 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors"
                title="Leave Meeting"
            >
                <PhoneOff size={24} />
            </button>

            
            <button
                onClick={toggleFullScreen}
                className={`p-3 rounded-full transition-colors ${isFullScreen 
                    ? 'bg-slate-950 hover:bg-slate-700 text-white'
                    : 'bg-gray-700 hover:bg-slate-950 text-white'
                } `}
                title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
                {isFullScreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
            </button>
        </div>
    );
}



export default Controls