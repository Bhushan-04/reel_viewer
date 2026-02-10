export interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}

export interface CloudinaryResponse {
    secure_url: string;
    public_id: string;
    format: string;
    resource_type: string;
    created_at: string;
}

export interface CloudinaryResource {
    public_id: string;
    version: number;
    format: string;
    width: number;
    height: number;
    type: string;
    created_at: string;
}

export interface CloudinaryListResponse {
    resources: CloudinaryResource[];
    updated_at: string;
}

export interface VideoItem {
    id: string;
    url: string;
    name: string;
    type: string;
    cloudinaryId?: string;
}

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
export const REEL_TAG = 'web_reel_app';

export const uploadToCloudinary = async (
    file: File,
    onProgress?: (progress: UploadProgress) => void
): Promise<CloudinaryResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('tags', REEL_TAG);

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable && onProgress) {
                onProgress({
                    loaded: e.loaded,
                    total: e.total,
                    percentage: Math.round((e.loaded / e.total) * 100),
                });
            }
        });

        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
            } else {
                reject(new Error(`Upload failed with status ${xhr.status}`));
            }
        });

        xhr.addEventListener('error', () => {
            reject(new Error('Upload failed'));
        });

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`);
        xhr.send(formData);
    });
};

export const fetchVideosByTag = async (): Promise<VideoItem[]> => {
    const url = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/any/list/${REEL_TAG}.json?cb=${Date.now()}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                return [];
            }
            throw new Error('Failed to fetch video list');
        }

        const data: CloudinaryListResponse = await response.json();

        return data.resources.map(resource => ({
            id: resource.public_id,
            url: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/v${resource.version}/${resource.public_id}.${resource.format}`,
            name: resource.public_id.split('/').pop() || 'Video',
            type: resource.format,
            cloudinaryId: resource.public_id
        }));
    } catch (error) {
        console.error('Error fetching videos:', error);
        return [];
    }
};
