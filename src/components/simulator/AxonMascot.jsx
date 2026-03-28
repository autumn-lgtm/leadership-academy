import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import mascotImg from '../../assets/einstein-mascot.png'

// ── Axon-isms: signature catchphrases ─────────────────────
const AXON_ISMS = [
  "Your brain rewires every time you try something new. No pressure.",
  "Fun fact: your team can literally feel your stress. Mirror neurons are snitches.",
  "Pause before you react. One breath. That's not weakness — that's your prefrontal cortex taking the wheel.",
  "Your habits run on autopilot so your brain can save energy for the hard stuff.",
  "Small wins trigger dopamine. That's not lazy — that's neuroscience.",
  "Listening isn't passive. Your brain is doing heavy lifting right now.",
  "The best leaders aren't born. They're wired through practice.",
  "Your \"gut feeling\"? That's millions of neural predictions running in parallel. Trust it more.",
  "Stress literally shrinks your thinking. Take care of your brain, and it'll take care of your team.",
  "Connection builds trust. Trust builds safety. Safety builds great teams. It's a loop.",
  "Nobody's leadership style is fixed. You're rewiring right now just by being here.",
  "The gap between who you are and who you want to be? That's where the growth happens.",
  "Every hard conversation you have builds a neural pathway that makes the next one easier.",
  "Your brain treats uncertainty like a threat. Great leaders learn to sit with it anyway.",
  "The leader your team sees is shaped by your habits, not your intentions. Habits are changeable.",
]

export default function AxonMascot({
  size = 140,
  mood = 'idle',
  showQuip = true,
  entrance = 'portal',  // 'portal' | 'fade' | 'none'
  className = '',
}) {
  const [quipIndex, setQuipIndex] = useState(() => Math.floor(Math.random() * AXON_ISMS.length))
  const [quipVisible, setQuipVisible] = useState(true)
  const [hasEntered, setHasEntered] = useState(entrance === 'none')

  // Cycle quips
  useEffect(() => {
    if (!showQuip) return
    const interval = setInterval(() => {
      setQuipVisible(false)
      setTimeout(() => {
        setQuipIndex(prev => (prev + 1) % AXON_ISMS.length)
        setQuipVisible(true)
      }, 400)
    }, 6000)
    return () => clearInterval(interval)
  }, [showQuip])

  // Entrance delay
  useEffect(() => {
    if (entrance === 'none') return
    const timer = setTimeout(() => setHasEntered(true), 100)
    return () => clearTimeout(timer)
  }, [entrance])

  const moodVariants = {
    idle: {
      y: [0, -8, 0],
      rotate: [0, 2, 0, -2, 0],
      transition: {
        y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
      },
    },
    excited: {
      y: [0, -16, 0],
      rotate: [0, 5, -5, 0],
      scale: [1, 1.08, 1],
      transition: {
        y: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' },
        scale: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' },
      },
    },
    thinking: {
      y: [0, -4, 0],
      rotate: [0, -6, 0],
      transition: {
        y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
      },
    },
    wave: {
      y: [0, -10, 0],
      rotate: [0, 8, -4, 0],
      scale: [1, 1.04, 1],
      transition: {
        y: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
      },
    },
  }

  // Portal entrance animation
  const portalVariants = {
    hidden: {
      scale: 0,
      rotate: -180,
      opacity: 0,
      filter: 'blur(20px)',
    },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 14,
        duration: 0.8,
      },
    },
  }

  const fadeVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const entranceVariant = entrance === 'portal' ? portalVariants : fadeVariants

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Speech bubble */}
      {showQuip && hasEntered && (
        <AnimatePresence mode="wait">
          {quipVisible && (
            <motion.div
              key={quipIndex}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative max-w-xs px-4 py-3 bg-bg-surface/80 backdrop-blur-sm border border-white/10 rounded-2xl rounded-bl-sm"
            >
              <p className="text-sm text-text-primary leading-relaxed italic">
                "{AXON_ISMS[quipIndex]}"
              </p>
              <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-bg-surface/80 border-b border-r border-white/10 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Axon — with entrance animation */}
      <motion.div
        className="relative axon-mascot"
        variants={entrance !== 'none' ? entranceVariant : undefined}
        initial={entrance !== 'none' ? 'hidden' : undefined}
        animate={entrance !== 'none' ? 'visible' : undefined}
      >
        {/* Portal vortex ring */}
        {entrance === 'portal' && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ transform: 'scale(1.8)' }}
            initial={{ opacity: 1, rotate: 0 }}
            animate={{ opacity: [1, 0], rotate: 360, scale: [1, 2] }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <div className="w-full h-full rounded-full axon-portal-ring" />
          </motion.div>
        )}

        {/* Particle burst on entrance */}
        {entrance === 'portal' && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: ['#00C8FF', '#B88AFF', '#00E896', '#FFB340', '#FF6B6B'][i % 5],
                  left: '50%',
                  top: '50%',
                }}
                initial={{ x: 0, y: 0, scale: 1 }}
                animate={{
                  x: Math.cos((i / 8) * Math.PI * 2) * 60,
                  y: Math.sin((i / 8) * Math.PI * 2) * 60,
                  scale: 0,
                  opacity: 0,
                }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.04, ease: 'easeOut' }}
              />
            ))}
          </motion.div>
        )}

        {/* Ambient glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0,200,255,0.12) 0%, rgba(184,138,255,0.06) 40%, transparent 70%)',
            filter: 'blur(24px)',
            transform: 'scale(1.8)',
          }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* The mascot — mix-blend-mode: screen kills the black bg */}
        <motion.div
          animate={moodVariants[mood] || moodVariants.idle}
        >
          <img
            src={mascotImg}
            alt="Axon — your NeuroLeader guide"
            width={size}
            height={size}
            className="relative select-none pointer-events-none axon-img"
            style={{
              objectFit: 'contain',
              mixBlendMode: 'screen',
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

// Re-export the quips so other components can use Axon-isms
export { AXON_ISMS }
