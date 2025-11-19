import { motion, AnimatePresence } from 'framer-motion'
import { Suspense } from 'react'
import VillageView from './VillageView'

interface VillageModalProps {
  onClose: () => void
}

export default function VillageModal({ onClose }: VillageModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
          <div className="sticky top-0 z-20 bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
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
                className="text-3xl"
              >
                🏛️
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white">마을 광장</h2>
                <p className="text-sm text-indigo-100">다른 플레이어들을 만나보세요</p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="닫기"
            >
              <span className="text-xl">✕</span>
            </motion.button>
          </div>

          {/* 컨텐츠 */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="text-4xl mb-2"
                  >
                    🏛️
                  </motion.div>
                  <p className="text-gray-500 ml-3">로딩 중...</p>
                </div>
              }
            >
              <VillageView />
            </Suspense>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

