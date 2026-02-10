import React from 'react';
import { useVideoStore } from '../store/videoStore';
import VideoCard from './VideoCard';
import { Button } from 'reactstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import 'swiper/css';

const ReelViewer: React.FC = () => {
    const { videos, toggleViewer } = useVideoStore();

    return (
        <div className="d-flex justify-content-center position-relative w-100 vh-100 overflow-hidden bg-transparent">
            <Button
                color="link"
                onClick={toggleViewer}
                className="position-absolute top-0 start-0 z-3 text-white text-decoration-none fs-4 rounded-circle d-flex align-items-center justify-content-center p-0"
                style={{
                    width: '50px',
                    height: '50px',
                    margin: '20px',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}
            >
                <FaArrowLeft />
            </Button>

            <div className="reel-container h-100 w-100 position-relative" style={{ maxWidth: '480px' }}>
                <Swiper
                    direction={'vertical'}
                    mousewheel={{
                        forceToAxis: true,
                        sensitivity: 0.1,
                        thresholdDelta: 50,
                        thresholdTime: 800
                    }}
                    modules={[Mousewheel]}
                    className="h-100 w-100"
                    style={{ height: '100vh' }}
                >
                    {videos.map((video) => (
                        <SwiperSlide key={video.id} className="h-100 w-100">
                            {({ isActive }) => (
                                <VideoCard video={video} isActive={isActive} />
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default ReelViewer;
