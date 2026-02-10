import { useEffect } from 'react'
import { useVideoStore } from './store/videoStore'
import Upload from './components/Upload'
import ReelViewer from './components/ReelViewer'

function App() {
    const { isViewerActive, init } = useVideoStore()

    useEffect(() => {
        init()
    }, [init])

    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>
            {isViewerActive ? <ReelViewer /> : <Upload />}
        </div>
    )
}

export default App
