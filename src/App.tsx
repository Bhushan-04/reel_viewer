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
        <div className="w-100" style={{ backgroundColor: 'var(--bg-dark)' }}>
            {isViewerActive ? <ReelViewer /> : <Upload />}
        </div>
    )
}

export default App
