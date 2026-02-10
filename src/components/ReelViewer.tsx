import React, { useEffect, useState } from 'react';
import { useVideoStore } from '../store/videoStore';
import VideoCard from './VideoCard';
import { Button } from 'reactstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import 'swiper/css';

const ReelViewer: React.FC = () => {
    const { videos, toggleViewer } = useVideoStore();
    const [appHeight, setAppHeight] = useState(window.innerHeight);

    useEffect(() => {
        const updateHeight = () => setAppHeight(window.innerHeight);
        window.addEventListener('resize', updateHeight);
        updateHeight();
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    return (
        <div
            className="d-flex justify-content-center position-relative w-100 overflow-hidden bg-transparent"
            style={{ height: `${appHeight}px` }}
        >
            <Button
                color="link"
                onClick={toggleViewer}
                className="position-absolute top-0 start-0 z-3 text-white text-decoration-none fs-5 back-btn p-0"
                style={{ margin: '20px' }}
            >
                <FaArrowLeft />
            </Button>

            <div className="reel-container w-100 position-relative" style={{ maxWidth: '480px', height: `${appHeight}px` }}>
                <Swiper
                    direction={'vertical'}
                    mousewheel={{
                        forceToAxis: true,
                        sensitivity: 0.1,
                        thresholdDelta: 50,
                        thresholdTime: 800
                    }}
                    modules={[Mousewheel]}
                    className="w-100"
                    style={{ height: `${appHeight}px` }}
                >
                    {videos.map((video) => (
                        <SwiperSlide key={video.id} style={{ height: `${appHeight}px` }}>
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
