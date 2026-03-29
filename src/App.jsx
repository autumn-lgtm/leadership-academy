import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { syncSession, syncBehaviorLog } from './lib/supabaseSync'
import SignIn from './components/auth/SignIn'
import Home from './screens/Home'
import Assessment from './screens/Assessment'
import Profile from './screens/Profile'
import Simulator from './screens/Simulator'
import NeuralBackground from './components/NeuralBackground'

export default function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    // Session lifecycle
    localStorage.setItem('nl_session_start', Date.now().toString())
    syncSession('start')

    function handleUnload() {
      syncSession('end')
      syncBehaviorLog('session_end')
    }
    window.addEventListener('beforeunload', handleUnload)

    // Get initial session — also processes magic link tokens from URL hash
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      setAuthLoading(false)
    })

    // Listen for auth changes (including magic link callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
        if (event === 'SIGNED_IN') {
          setAuthLoading(false)
        }
        if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [])

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#050810',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          border: '2px solid rgba(0,200,255,0.2)',
          borderTopColor: '#00C8FF',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!user) return <SignIn />

  return (
    <>
      <NeuralBackground />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/simulator" element={<Simulator />} />
      </Routes>
    </>
  )
}
