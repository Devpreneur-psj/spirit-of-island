import { motion, AnimatePresence } from 'framer-motion'
import { Suspense, ReactNode } from 'react'

interface FeatureModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  icon: string
  children: ReactNode
  color?: string
}

export default function FeatureModal({ 
  isOpen, 
  onClose, 
  title, 
  description,
  icon,
  children,
  color = 'from-indigo-500 to-purple-600'
}: FeatureModalProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* 배경 오버레이 */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* 모달 컨텐츠 */}
        <motion.div
          className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden z-10"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className={`sticky top-0 z-20 bg-gradient-to-r ${color} px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-lg`}>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="text-2xl sm:text-3xl flex-shrink-0"
              >
                {icon}
              </motion.div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-2xl font-bold text-white truncate">{title}</h2>
                {description && (
                  <p className="text-xs sm:text-sm text-white/90 truncate">{description}</p>
                )}
              </div>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 flex-shrink-0"
              aria-label="닫기"
            >
              <span className="text-lg sm:text-xl">✕</span>
            </motion.button>
          </div>

          {/* 컨텐츠 */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-4 sm:p-6">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

