import { Routes, Route } from 'react-router-dom'
import Home from './screens/Home'
import Assessment from './screens/Assessment'
import Profile from './screens/Profile'
import Simulator from './screens/Simulator'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/assessment" element={<Assessment />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/simulator" element={<Simulator />} />
    </Routes>
  )
}
