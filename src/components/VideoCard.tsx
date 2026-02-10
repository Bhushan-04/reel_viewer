import React, { useRef, useEffect, useState } from 'react';
import { type VideoItem } from '../store/videoStore';
import { FaVolumeMute, FaVolumeUp, FaPlay, FaPause } from 'react-icons/fa';

interface VideoCardProps {
    video: VideoItem;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showIndicator, setShowIndicator] = useState<'play' | 'pause' | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        videoRef.current?.play().catch(() => {
                            console.log('Autoplay blocked');
                        });
                        setIsPlaying(true);
                    } else {
                        videoRef.current?.pause();
                        setIsPlaying(false);
                        if (videoRef.current) {
                            videoRef.current.currentTime = 0;
                        }
                    }
                });
            },
            { threshold: 0.6 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

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

            // Auto hide indicator after 500ms
            setTimeout(() => {
                setShowIndicator(null);
            }, 500);
        }
    };

    return (
        <div
            ref={containerRef}
            style={{
                height: '100%',
                width: '100%',
                scrollSnapAlign: 'start',
                position: 'relative',
                backgroundColor: '#000',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
            }}
        >
            <video
                ref={videoRef}
                src={video.url}
                loop
                muted={isMuted}
                playsInline
                style={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'cover',
                    cursor: 'pointer'
                }}
                onClick={togglePlay}
            />

            {/* Play/Pause Visual Indicator Overlay */}
            {showIndicator && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '2rem',
                    pointerEvents: 'none',
                    animation: 'fadeScale 0.5s ease-out',
                    zIndex: 30
                }}>
                    {showIndicator === 'play' ? <FaPlay /> : <FaPause />}
                </div>
            )}

            <style>{`
                @keyframes fadeScale {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
                }
            `}</style>

            {/* Buttons Container */}
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                zIndex: 20
            }}>
                {/* Mute Button */}
                <div
                    style={{
                        background: 'rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '50%',
                        padding: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                </div>
            </div>

            {/* Bottom Info Overlay */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '100%',
                    padding: '60px 20px 30px',
                    zIndex: 10,
                    color: 'white',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    pointerEvents: 'none'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #FF00CC, #3333FF)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                    }}>
                        {video.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>@{video.name.split('.')[0]}</span>
                </div>
                <h5 style={{
                    fontSize: '1rem',
                    fontWeight: 400,
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.4'
                }}>
                    Check out this awesome reel! 🚀 #viral #reels
                </h5>
            </div>
        </div>
    );
};

export default VideoCard;
