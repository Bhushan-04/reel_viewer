import React, { useRef, useEffect, useState } from 'react';
import { type VideoItem, useVideoStore } from '../store/videoStore';
import { FaVolumeMute, FaVolumeUp, FaPlay, FaPause } from 'react-icons/fa';

interface VideoCardProps {
    video: VideoItem;
    isActive: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, isActive }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { isMuted, toggleMute } = useVideoStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const [showIndicator, setShowIndicator] = useState<'play' | 'pause' | null>(null);

    // Smart Audio & Playback Logic: Driven by Swiper's active state
    useEffect(() => {
        if (isActive) {
            // Play video when active
            videoRef.current?.play().catch(() => console.log('Autoplay blocked'));
            setIsPlaying(true);
        } else {
            // Pause and reset when not active
            videoRef.current?.pause();
            if (videoRef.current) {
                videoRef.current.currentTime = 0;
            }
            setIsPlaying(false);
        }
    }, [isActive]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
                setShowIndicator('pause');
            } else {
                videoRef.current.play();
                setIsPlaying(true);
                setShowIndicator('play');
            }
            setTimeout(() => setShowIndicator(null), 500);
        }
    };

    return (
        <div className="position-relative w-100 h-100 bg-black d-flex justify-content-center align-items-center overflow-hidden">
            <video
                ref={videoRef}
                src={video.url}
                loop
                muted={isMuted}
                playsInline
                className="w-100 h-100 object-fit-contain"
                style={{ cursor: 'pointer' }}
                onClick={togglePlay}
            />

            {/* Play/Pause Visual Indicator Overlay */}
            {showIndicator && (
                <div
                    className="position-absolute top-50 start-50 translate-middle bg-dark bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center text-white video-indicator animate-fade-scale"
                >
                    {showIndicator === 'play' ? <FaPlay /> : <FaPause />}
                </div>
            )}

            {/* Buttons Container */}
            <div className="position-absolute top-0 end-0 d-flex flex-column gap-3 z-3" style={{ marginTop: '20px', marginRight: '20px' }}>
                {/* Mute Button */}
                <div
                    className="bg-black bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center text-white border border-white border-opacity-10 shadow-sm"
                    style={{
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)'
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                    }}
                >
                    {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                </div>
            </div>

            {/* Bottom Info Overlay */}
            <div
                className="position-absolute bottom-0 start-0 w-100 pe-none text-white z-2 p-3 pt-5 bg-gradient-overlay"
            >
                <div className="d-flex align-items-center gap-2 mb-2">
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white small bg-gradient-avatar"
                        style={{ width: '36px', height: '36px' }}
                    >
                        {video.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="fw-semibold small">@{video.name.split('.')[0]}</span>
                </div>
                <h5
                    className="fw-normal m-0 lh-base text-truncate"
                    style={{
                        fontSize: '1rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        whiteSpace: 'normal'
                    }}
                >
                    Check out this awesome reel! 🚀 #viral #reels
                </h5>
            </div>
        </div>
    );
};

export default VideoCard;
