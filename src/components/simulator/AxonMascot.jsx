import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import mascotImg from '../../assets/einstein-mascot.png'

const AXON_QUIPS = [
  "Your brain rewires every time you try something new. No pressure.",
  "Fun fact: your team can literally feel your stress. Mirror neurons are snitches.",
  "Leaders who pause before reacting make 40% better decisions. Breathing is underrated.",
  "Your habits run on autopilot so your brain can save energy for the hard stuff.",
  "Small wins trigger dopamine. That's not lazy — that's neuroscience.",
  "Listening isn't passive. Your brain is doing heavy lifting right now.",
  "The best leaders aren't born. They're wired through practice.",
  "Your \"gut feeling\" is actually millions of neural predictions running in parallel.",
  "Stress shrinks your thinking. Literally. Your prefrontal cortex checks out.",
  "Connection builds trust. Trust builds safety. Safety builds great teams.",
]

export default function AxonMascot({ size = 140, mood = 'idle', showQuip = true }) {
  const [quipIndex, setQuipIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!showQuip) return
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setQuipIndex(prev => (prev + 1) % AXON_QUIPS.length)
        setVisible(true)
      }, 400)
    }, 6000)
    return () => clearInterval(interval)
  }, [showQuip])

  const moodVariants = {
    idle: {
      y: [0, -6, 0],
      rotate: [0, 1.5, 0, -1.5, 0],
      transition: {
        y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
      },
    },
    excited: {
      y: [0, -14, 0],
      rotate: [0, 4, -4, 0],
      scale: [1, 1.05, 1],
      transition: {
        y: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
        scale: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' },
      },
    },
    thinking: {
      y: [0, -3, 0],
      rotate: [0, -8, 0],
      transition: {
        y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
      },
    },
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Speech bubble */}
      {showQuip && (
        <AnimatePresence mode="wait">
          {visible && (
            <motion.div
              key={quipIndex}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative max-w-xs px-4 py-3 bg-bg-surface border border-white/10 rounded-2xl rounded-bl-sm"
            >
              <p className="text-sm text-text-primary leading-relaxed">
                {AXON_QUIPS[quipIndex]}
              </p>
              {/* Bubble tail */}
              <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-bg-surface border-b border-r border-white/10 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Mascot image with animations */}
      <motion.div
        className="relative axon-mascot"
        animate={moodVariants[mood] || moodVariants.idle}
      >
        {/* Glow ring behind mascot */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,200,255,0.08) 0%, transparent 70%)',
            filter: 'blur(20px)',
            transform: 'scale(1.5)',
          }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <img
          src={mascotImg}
          alt="Axon — your NeuroLeader guide"
          width={size}
          height={size}
          className="relative select-none pointer-events-none"
          style={{
            objectFit: 'contain',
            filter: 'drop-shadow(0 8px 24px rgba(0, 200, 255, 0.12))',
          }}
        />
      </motion.div>
    </div>
  )
}
