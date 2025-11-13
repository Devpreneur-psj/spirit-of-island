import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Spiritling } from '../types'

interface LevelUpNotificationProps {
  spiritling: Spiritling | null
  previousLevel: number | null
}

export default function LevelUpNotification({ spiritling, previousLevel }: LevelUpNotificationProps) {
  const [showNotification, setShowNotification] = useState(false)
  const [notificationData, setNotificationData] = useState<{ name: string; level: number } | null>(null)

  useEffect(() => {
    if (spiritling && previousLevel !== null && spiritling.level > previousLevel) {
      setNotificationData({
        name: spiritling.name,
        level: spiritling.level,
      })
      setShowNotification(true)
      
      // 5초 후 자동으로 닫기
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [spiritling?.level, previousLevel])

  const handleClose = () => {
    setShowNotification(false)
  }

  return (
    <AnimatePresence>
      {showNotification && notificationData && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-lg shadow-2xl p-4 sm:p-6 border-4 border-yellow-500 min-w-[280px] sm:min-w-[300px] max-w-[90vw] sm:max-w-md mx-2 relative overflow-hidden">
            {/* 반짝이는 배경 효과 */}
            <div className="absolute inset-0">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
            
            <div className="text-center relative z-10">
              {/* 여러 개의 반짝이는 이모지 */}
              <div className="relative mb-3 sm:mb-4">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="text-5xl sm:text-7xl inline-block"
                >
                  ✨
                </motion.div>
                <motion.div
                  className="absolute -top-2 -left-2 text-2xl sm:text-3xl"
                  animate={{
                    rotate: [0, -360],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  ⭐
                </motion.div>
                <motion.div
                  className="absolute -top-2 -right-2 text-2xl sm:text-3xl"
                  animate={{
                    rotate: [0, 360],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 0.5,
                  }}
                >
                  💫
                </motion.div>
              </div>
              
              <motion.h3 
                className="text-xl sm:text-2xl font-bold text-gray-800 mb-2"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                레벨 업! 🎉
              </motion.h3>
              
              <p className="text-base sm:text-lg text-gray-700 mb-1">
                <span className="font-semibold">{notificationData.name}</span>이(가)
              </p>
              
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.2, 
                  type: 'spring', 
                  stiffness: 200,
                  damping: 15,
                }}
                className="text-4xl sm:text-5xl font-bold text-yellow-600 mb-3 sm:mb-4 inline-block"
              >
                레벨 {notificationData.level}
              </motion.div>
              
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                🎊 새로운 성장 단계에 도달했습니다! 🎊
              </p>
              
              <motion.button
                onClick={handleClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm sm:text-base min-h-[44px] min-w-[100px] font-medium shadow-lg"
              >
                확인
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

