import React from 'react';
import { useVideoStore } from '../store/videoStore';
import VideoCard from './VideoCard';
import { Button } from 'reactstrap';
import { FaArrowLeft } from 'react-icons/fa';

const ReelViewer: React.FC = () => {
    const { videos, toggleViewer } = useVideoStore();

    return (
        <div className="d-flex justify-content-center" style={{ height: '100vh', width: '100%', overflow: 'hidden', background: 'transparent' }}>
            {/* Back Button - Absolute to screen */}
            <Button
                color="link"
                onClick={toggleViewer}
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    zIndex: 100,
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '1.5rem',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}
            >
                <FaArrowLeft />
            </Button>

            {/* Centered Scroll Container */}
            <div
                className="reel-container"
                style={{
                    height: '100%',
                    width: '100%',
                    overflowY: 'scroll',
                    scrollSnapType: 'y mandatory',
                    scrollBehavior: 'smooth',
                    position: 'relative'
                }}
            >
                {videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </div>
        </div>
    );
};

export default ReelViewer;
