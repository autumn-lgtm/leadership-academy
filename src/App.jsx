import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { onAuthChange } from './lib/auth'
import SignIn from './components/auth/SignIn'
import Home from './screens/Home'
import Assessment from './screens/Assessment'
import Profile from './screens/Profile'
import Simulator from './screens/Simulator'

export default function App() {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    const { data: { subscription } } = onAuthChange(setUser)
    return () => subscription.unsubscribe()
  }, [])

  if (user === undefined) return null

  if (!user) return <SignIn />

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/assessment" element={<Assessment />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/simulator" element={<Simulator />} />
    </Routes>
  )
}
