# Reel Demo App

A serverless "YouTube Shorts" style video viewer built with React, Vite, and Cloudinary.

## Features
- **Swipe Navigation**: Snap scrolling (Shorts/TikTok style) using SwiperJS.
- **Auto-Play/Pause**: Only the active video plays; others pause instantly.
- **Cloud Sync**: Uploads videos to Cloudinary without a backend server.
- **Cross-Device**: Videos uploaded on one device appear on all others.
- **PWA Ready**: Mobile-first design.

## Stack
- **Framework**: React + Vite + TypeScript
- **Styling**: Bootstrap 5 
- **State**: Zustand
- **Media**: Cloudinary (for storage and delivery)
- **Gestures**: SwiperJS

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Create a `.env` file in the root directory:
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
   ```

    **Note**: Make sure your Cloudinary Preset is set to **"Unsigned"** and you have unticked **"Resource List"** in Settings > Security.

3. **Run Locally**
   ```bash
   npm run dev
   ```

## Build
To create a production build:
```bash
npm run build
```
