'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Preloader() {
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer)
          setTimeout(() => setLoading(false), 150) // Reduce the delay for hiding preloader
          return 100
        }
        const diff = Math.random() * 20 // Increase the progress increment speed
        return Math.min(oldProgress + diff, 100)
      })
    }, 100) // Reduce the interval time for faster progress

    return () => clearInterval(timer)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          exit={{
            scale: 1.5,
            opacity: 0,
            transition: { duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] } // Slightly faster exit
          }}
        >
          <motion.h1
            className="text-4xl font-bold mb-8 text-blue-300"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            Setting the Stage for Excitement
          </motion.h1>
          <div className="relative w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-blue-400"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
            <motion.div
              className="absolute top-0 left-0 h-full bg-blue-300 opacity-50 blur-sm"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
            <motion.div
              className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.2, // Slightly faster animation loop
                ease: 'linear',
              }}
            />
          </div>
          <motion.div
            className="mt-4 text-xl font-semibold text-blue-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {Math.round(progress)}%
          </motion.div>
          <motion.div
            className="absolute bottom-10 text-sm text-blue-200 opacity-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.5, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }} // Faster fade-in
          >
           Just a moment while we gather the best events for you..
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
