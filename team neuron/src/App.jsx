import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <div>
        <h1>Video Stream</h1>
        <img src="http://localhost:5000/video_feed" alt="Webcam Stream" />
    </div>
    </>
  )
}

export default App
