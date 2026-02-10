import React, { useRef, useState } from 'react';
import { Container, Card, CardBody, Button, Spinner } from 'reactstrap';
import { useVideoStore } from '../store/videoStore';
import { FaCloudUploadAlt, FaFolder, FaFileVideo } from 'react-icons/fa';

const Upload: React.FC = () => {
    const { addVideos, toggleViewer, videos } = useVideoStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const folderInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(Array.from(e.target.files));
        }
    };

    const processFiles = async (files: File[]) => {
        setIsLoading(true);
        const videoFiles = files.filter(file => file.type.startsWith('video/'));

        try {
            await addVideos(videoFiles);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(Array.from(e.dataTransfer.files));
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center vh-100">
            <Card
                className={`shadow-lg border-0 upload-card upload-card-hover upload-card-container ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <CardBody className="text-center p-5">
                    <div className="mb-4">
                        <FaCloudUploadAlt size={64} className="icon-filter" />
                    </div>
                    <h3 className="mb-3 fw-bold">Upload Reels</h3>

                    {isLoading ? (
                        <div className="mb-4 text-light opacity-75">
                            <Spinner size="sm" className="me-2" color="light" />
                            {videos.length === 0 ? 'Syncing with Cloudinary...' : 'Uploading...'}
                        </div>
                    ) : (
                        <p className="text-secondary mb-4 small">
                            {videos.length > 0 ? `Synced: ${videos.length} videos found.` : 'Cloud is empty. Start by uploading!'}
                        </p>
                    )}

                    <div className="d-grid gap-3 mb-4">
                        <input
                            type="file"
                            multiple
                            accept="video/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <Button className="btn-custom-primary py-2" onClick={() => fileInputRef.current?.click()}>
                            <FaFileVideo className="me-2" /> Select Videos
                        </Button>

                        <input
                            type="file"
                            ref={folderInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            {...({ webkitdirectory: "", directory: "" } as any)}
                        />
                        <Button className="btn-custom-outline py-2" onClick={() => folderInputRef.current?.click()}>
                            <FaFolder className="me-2" /> Select Folder
                        </Button>
                    </div>

                    {isLoading && (
                        <div className="mb-3 text-light">
                            <Spinner size="sm" color="light" /> Processing...
                        </div>
                    )}

                    {videos.length > 0 && (
                        <div className="mt-4 pt-3 border-top border-secondary">
                            <p className="text-accent fw-bold">{videos.length} videos ready</p>
                            <Button className="btn-custom-primary w-100" size="lg" onClick={toggleViewer}>
                                Watch Reels
                            </Button>
                        </div>
                    )}
                </CardBody>
            </Card>
        </Container>
    );
};

export default Upload;
