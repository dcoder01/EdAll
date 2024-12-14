import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParticipant } from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import { Maximize2, Minimize2 } from 'lucide-react';
import { toast} from 'react-toastify';
const ParticipantView = (props) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const micRef = useRef(null);

    const { 
        webcamStream, 
        micStream, 
        webcamOn, 
        micOn, 
        isLocal, 
        displayName 
    } = useParticipant(props.participantId);

    const videoStream = useMemo(() => {
        if (webcamOn && webcamStream) {
            const mediaStream = new MediaStream();
            mediaStream.addTrack(webcamStream.track);
            return mediaStream;
        }
    }, [webcamStream, webcamOn]);

    useEffect(() => {
        if (micRef.current) {
            if (micOn && micStream) {
                const mediaStream = new MediaStream();
                mediaStream.addTrack(micStream.track);

                micRef.current.srcObject = mediaStream;
                micRef.current
                    .play()
                    .catch((error) =>
                        // console.error("audioElem.current.play() failed", error)
                        toast.error("audioElem.current.play() failed")
                    );
            } else {
                micRef.current.srcObject = null;
            }
        }
    }, [micStream, micOn]);

    const toggleFullScreen = () => {
        const element = containerRef.current;
        if (!element) return;

        if (!document.fullscreenElement) {
            element.requestFullscreen().catch((err) => {
                // console.error("Failed to enter fullscreen:", err);
                toast.error("Failed to enter fullscreen")
            });
        } else {
            document.exitFullscreen().catch((err) => {
                // console.error("Failed to exit fullscreen:", err);
                toast.error("Failed to exit fullscreen")
            });
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    return (
        <div 
            ref={containerRef}
            className={`relative p-1 rounded-lg ${webcamOn ? 'bg-gray-800' : 'bg-gray-900'}`} 
            style={{ 
                aspectRatio: '16/9',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            {webcamOn ? (
                <div className="relative w-full h-full">
                    <ReactPlayer
                        ref={videoRef}
                        playsinline
                        pip={false}
                        light={false}
                        controls={false}
                        muted={true}
                        playing={true}
                        url={videoStream}
                        width="100%"
                        height="100%"
                        onError={(err) => {
                            // console.log(err, "participant video error");
                            toast.error("participant video error")
                        }}
                    />
                    <button 
                        onClick={toggleFullScreen}
                        className="absolute top-2 right-2 z-10 bg-black/50 p-2 rounded-full text-white"
                        title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                    >
                        {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                </div>
            ) : (
                <div className="text-white opacity-70">Camera Off</div>
            )}
            <div className="absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded-md text-sm">
                {displayName || 'Participant'}
            </div>
            <audio ref={micRef} autoPlay playsInline muted={isLocal} />
        </div>
    );
};

export default ParticipantView;
