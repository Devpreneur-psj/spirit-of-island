import { motion } from 'framer-motion'
import { useSpiritlingStore } from '../stores/spiritlingStore'
import { Spiritling, toDisplayFormat } from '../types'

export default function IslandView() {
  const { selectedSpiritling } = useSpiritlingStore()

  return (
    <div className="card relative h-64 sm:h-80 lg:h-96 overflow-hidden">
      {/* 하늘 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-b from-pastel-blue via-pastel-purple to-pastel-pink opacity-60" />
      
      {/* 별 배경 */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* 구름 효과 (더 많은 구름) */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-6 sm:top-10 left-6 sm:left-10 w-24 sm:w-32 h-12 sm:h-16 bg-white/40 rounded-full blur-2xl"
          animate={{
            x: [0, 30, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-12 sm:top-20 right-12 sm:right-20 w-28 sm:w-40 h-14 sm:h-20 bg-white/35 rounded-full blur-2xl"
          animate={{
            x: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-20 sm:top-32 left-1/4 w-20 sm:w-28 h-10 sm:h-14 bg-white/30 rounded-full blur-xl"
          animate={{
            x: [0, 15, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* 섬 (더 디테일한 섬) */}
      <motion.div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 sm:w-64 h-24 sm:h-32 rounded-t-full"
        style={{
          background: 'linear-gradient(to bottom, #86efac, #4ade80, #22c55e)',
          boxShadow: '0 -10px 30px rgba(34, 197, 94, 0.3)',
        }}
        animate={{
          scaleY: [1, 1.02, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* 섬 위 풀잎 장식 */}
        <div className="absolute top-0 left-1/4 w-2 h-4 bg-green-600 rounded-full transform rotate-12" />
        <div className="absolute top-0 right-1/4 w-2 h-4 bg-green-600 rounded-full transform -rotate-12" />
        <div className="absolute top-1 left-1/2 w-2 h-3 bg-green-600 rounded-full transform -translate-x-1/2" />
      </motion.div>

      {/* 마정령 */}
      {selectedSpiritling ? (
        <SpiritlingSprite spiritling={selectedSpiritling} />
      ) : (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-4xl sm:text-5xl mb-2"
            >
              🦄
            </motion.div>
            <p className="text-sm sm:text-base text-gray-500 px-4">마정령을 선택해주세요</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function SpiritlingSprite({ spiritling }: { spiritling: Spiritling }) {
  const display = toDisplayFormat(spiritling)
  
  const getElementColor = (element: string) => {
    const colors: Record<string, string> = {
      fire: 'bg-element-fire',
      water: 'bg-element-water',
      wind: 'bg-element-wind',
      earth: 'bg-element-earth',
      plant: 'bg-element-plant',
      electric: 'bg-element-electric',
      light: 'bg-element-light',
      dark: 'bg-element-dark',
    }
    return colors[element] || 'bg-gray-300'
  }

  // 속성별 이모지 및 색상
  const getElementEmoji = (element: string) => {
    const emojis: Record<string, string> = {
      fire: '🔥',
      water: '💧',
      wind: '🌪️',
      earth: '🌍',
      plant: '🌱',
      electric: '⚡',
      light: '✨',
      dark: '🌙',
    }
    return emojis[element] || '🦄'
  }

  const getElementGlow = (element: string) => {
    const glows: Record<string, string> = {
      fire: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]',
      water: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
      wind: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]',
      earth: 'shadow-[0_0_20px_rgba(234,179,8,0.5)]',
      plant: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]',
      electric: 'shadow-[0_0_20px_rgba(234,179,8,0.5)]',
      light: 'shadow-[0_0_20px_rgba(250,204,21,0.5)]',
      dark: 'shadow-[0_0_20px_rgba(107,114,128,0.5)]',
    }
    return glows[element] || 'shadow-[0_0_20px_rgba(139,92,246,0.5)]'
  }

  return (
    <motion.div
      className="absolute bottom-20 sm:bottom-24 lg:bottom-32 left-1/2 transform -translate-x-1/2 z-10"
      animate={{
        y: [0, -12, 0],
        rotate: [0, 3, 0, -3, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* 빛나는 효과 */}
      <motion.div
        className={`absolute inset-0 ${getElementColor(display.element)} rounded-full blur-xl opacity-50`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* 마정령 스프라이트 */}
      <motion.div
        className={`relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 ${getElementColor(display.element)} rounded-full ${getElementGlow(display.element)} flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl border-4 border-white/50`}
        whileHover={{ scale: 1.1 }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(139, 92, 246, 0.3)',
            '0 0 30px rgba(139, 92, 246, 0.5)',
            '0 0 20px rgba(139, 92, 246, 0.3)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* 속성 이모지 */}
        <motion.span
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {getElementEmoji(display.element)}
        </motion.span>
        
        {/* 레벨 표시 */}
        <div className="absolute -top-2 -right-2 bg-pastel-purple text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-lg">
          {display.level}
        </div>
      </motion.div>
      
      {/* 이름 태그 */}
      <motion.div
        className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-black/70 to-black/50 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap shadow-lg backdrop-blur-sm border border-white/20"
        initial={{ opacity: 0, y: 10, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
        }}
      >
        {display.name}
      </motion.div>
      
      {/* 성장 단계 표시 */}
      {display.growthStage !== 'egg' && (
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm text-gray-600 font-medium bg-white/80 px-2 py-1 rounded-full shadow-md"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {display.growthStage === 'infant' && '👶 유아'}
          {display.growthStage === 'adolescent' && '🧒 청소년'}
          {display.growthStage === 'adult' && '👤 성체'}
          {display.growthStage === 'transcendent' && '✨ 초월체'}
          {display.growthStage === 'elder' && '👴 노년'}
        </motion.div>
      )}
    </motion.div>
  )
}

