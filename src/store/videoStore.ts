import { create } from 'zustand';
import { uploadToCloudinary, fetchVideosByTag } from '../services/cloudinary';

export interface VideoItem {
    id: string;
    url: string;
    name: string;
    type: string;
    cloudinaryId?: string;
}

interface VideoState {
    videos: VideoItem[];
    isViewerActive: boolean;
    isLoading: boolean;
    isMuted: boolean;
    uploadProgress: { [key: string]: number };
    addVideos: (files: File[]) => Promise<void>;
    toggleViewer: () => void;
    toggleMute: () => void;
    clearVideos: () => void;
    removeVideo: (id: string) => void;
    init: () => Promise<void>;
}

export const useVideoStore = create<VideoState>((setState) => ({
    videos: [],
    isViewerActive: false,
    isLoading: false,
    isMuted: false,
    uploadProgress: {},

    init: async () => {
        setState({ isLoading: true });
        try {
            const fetchedVideos = await fetchVideosByTag();
            setState({ videos: fetchedVideos });
        } finally {
            setState({ isLoading: false });
        }
    },

    addVideos: async (files: File[]) => {
        const uploadedVideos: VideoItem[] = [];

        for (const file of files) {
            const tempId = `temp-${crypto.randomUUID()}`;

            setState((state) => ({
                uploadProgress: { ...state.uploadProgress, [tempId]: 0 }
            }));

            try {
                const response = await uploadToCloudinary(file, (progress) => {
                    setState((state) => ({
                        uploadProgress: { ...state.uploadProgress, [tempId]: progress.percentage }
                    }));
                });

                const videoItem: VideoItem = {
                    id: crypto.randomUUID(),
                    url: response.secure_url,
                    name: file.name,
                    type: response.format,
                    cloudinaryId: response.public_id
                };

                uploadedVideos.push(videoItem);

                setState((state) => {
                    const newProgress = { ...state.uploadProgress };
                    delete newProgress[tempId];
                    return { uploadProgress: newProgress };
                });
            } catch (error) {
                console.error('Upload failed:', error);
                setState((state) => {
                    const newProgress = { ...state.uploadProgress };
                    delete newProgress[tempId];
                    return { uploadProgress: newProgress };
                });
            }
        }

        setState((state) => ({
            videos: [...uploadedVideos, ...state.videos]
        }));
    },

    toggleViewer: () => {
        setState((state) => ({
            isViewerActive: !state.isViewerActive,
        }));
    },

    toggleMute: () => {
        setState((state) => ({
            isMuted: !state.isMuted,
        }));
    },

    clearVideos: () => {
        setState({
            videos: [],
            isViewerActive: false,
        });
    },

    removeVideo: (id: string) => {
        setState((state) => {
            const updatedVideos = state.videos.filter(v => v.id !== id);
            return {
                videos: updatedVideos,
                isViewerActive: updatedVideos.length > 0
            };
        });
    }
}));
