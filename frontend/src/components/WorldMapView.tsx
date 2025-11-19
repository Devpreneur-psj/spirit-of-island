import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { locations, Location, getUnlockedLocations } from '../config/locations'
import { useSpiritlingStore } from '../stores/spiritlingStore'
import { Spiritling, toDisplayFormat } from '../types'
import IsometricBuilding from './IsometricBuilding'

interface WorldMapViewProps {
  onLocationClick: (location: Location) => void
  currentTab?: string
}

export default function WorldMapView({ onLocationClick, currentTab }: WorldMapViewProps) {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)
  const { selectedSpiritling } = useSpiritlingStore()
  const unlockedLocations = getUnlockedLocations()
  const isElementHome = currentTab === 'spiritling'

  const handleLocationClick = useCallback((location: Location) => {
    if (location.unlocked !== false && location.tab) {
      onLocationClick(location)
    }
  }, [onLocationClick])

  const getLocationStyle = (location: Location) => {
    const isActive = currentTab === location.tab
    const isHovered = hoveredLocation === location.id
    const isLocked = location.unlocked === false

    return {
      left: `${location.position.x}%`,
      top: `${location.position.y}%`,
      transform: 'translate(-50%, -50%)',
    }
  }

  return (
    <div className="relative w-full h-[600px] sm:h-[700px] bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-100 rounded-2xl overflow-hidden shadow-2xl">
      {/* 배경 요소들 */}
      <div className="absolute inset-0">
        {/* 구름 */}
        <motion.div
          className="absolute top-10 left-10 text-6xl opacity-30"
          animate={{
            x: [0, 20, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          ☁️
        </motion.div>
        <motion.div
          className="absolute top-20 right-20 text-5xl opacity-20"
          animate={{
            x: [0, -15, 0],
            y: [0, 5, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          ☁️
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-1/4 text-4xl opacity-25"
          animate={{
            x: [0, 10, 0],
            y: [0, -5, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          ☁️
        </motion.div>

        {/* 태양 */}
        <motion.div
          className="absolute top-5 right-5 text-5xl sm:text-6xl"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: {
              duration: 60,
              repeat: Infinity,
              ease: 'linear',
            },
            scale: {
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          ☀️
        </motion.div>

        {/* 섬들 */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-300 via-green-200 to-green-100 rounded-t-full">
          {/* 작은 섬들 */}
          <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-green-400 rounded-full opacity-60"></div>
          <div className="absolute bottom-0 right-1/3 w-24 h-24 bg-green-300 rounded-full opacity-50"></div>
        </div>
      </div>

      {/* 장소들 - 이소메트릭 건물 형태 */}
      {unlockedLocations.map((location) => {
        const isActive = currentTab === location.tab
        const isHovered = hoveredLocation === location.id
        const isLocked = location.unlocked === false

        return (
          <IsometricBuilding
            key={location.id}
            location={location}
            isHovered={isHovered || isActive}
            isUnlocked={!isLocked}
            onClick={() => handleLocationClick(location)}
            onMouseEnter={() => setHoveredLocation(location.id)}
            onMouseLeave={() => setHoveredLocation(null)}
          />
        )
      })}

      {/* 원소 홈에서 정령 표시 */}
      {isElementHome && selectedSpiritling && (
        <SpiritlingDisplay spiritling={selectedSpiritling} />
      )}

      {/* 연결선 (장소들 간의 경로) */}
      <svg className="absolute inset-0 pointer-events-none opacity-20" style={{ zIndex: 1 }}>
        {unlockedLocations.map((location, index) => {
          if (index === 0 || location.unlocked === false) return null
          
          const prevLocation = unlockedLocations[index - 1]
          if (prevLocation.unlocked === false) return null

          return (
            <motion.line
              key={`path-${index}`}
              x1={`${prevLocation.position.x}%`}
              y1={`${prevLocation.position.y}%`}
              x2={`${location.position.x}%`}
              y2={`${location.position.y}%`}
              stroke="rgba(139, 92, 246, 0.3)"
              strokeWidth="2"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
          )
        })}
      </svg>

      {/* 제목 */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
        >
          <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-pastel-purple to-pastel-pink bg-clip-text text-transparent">
            정령의 섬
          </h2>
        </motion.div>
      </div>
    </div>
  )
}

// 정령 표시 컴포넌트
function SpiritlingDisplay({ spiritling }: { spiritling: Spiritling }) {
  const display = toDisplayFormat(spiritling)
  
  const getElementEmoji = (element: string) => {
    const emojis: Record<string, string> = {
      fire: '🔥',
      water: '💧',
      earth: '🌍',
      air: '💨',
      light: '✨',
      dark: '🌙',
    }
    return emojis[element] || '🦄'
  }

  const getElementGlow = (element: string) => {
    const glows: Record<string, string> = {
      fire: 'shadow-[0_0_30px_rgba(239,68,68,0.6)]',
      water: 'shadow-[0_0_30px_rgba(59,130,246,0.6)]',
      earth: 'shadow-[0_0_30px_rgba(234,179,8,0.6)]',
      air: 'shadow-[0_0_30px_rgba(34,197,94,0.6)]',
      light: 'shadow-[0_0_30px_rgba(250,204,21,0.6)]',
      dark: 'shadow-[0_0_30px_rgba(107,114,128,0.6)]',
    }
    return glows[element] || 'shadow-[0_0_30px_rgba(139,92,246,0.6)]'
  }

  // 원소 홈 위치 (20%, 30%)
  return (
    <motion.div
      className="absolute"
      style={{
        left: '20%',
        top: '30%',
        transform: 'translate(-50%, -50%)',
        zIndex: 15,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: [0, -15, 0],
        rotate: [0, 3, 0, -3, 0],
      }}
      transition={{
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
        y: {
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        rotate: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
    >
      {/* 빛나는 효과 */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br from-pastel-purple to-pastel-pink rounded-full blur-2xl opacity-50`}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* 정령 스프라이트 */}
      <motion.div
        className={`relative w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-pastel-purple to-pastel-pink rounded-full ${getElementGlow(display.element)} flex items-center justify-center text-5xl sm:text-6xl border-4 border-white/70 shadow-2xl`}
        whileHover={{ scale: 1.15 }}
        animate={{
          boxShadow: [
            '0 0 30px rgba(139, 92, 246, 0.4)',
            '0 0 50px rgba(139, 92, 246, 0.6)',
            '0 0 30px rgba(139, 92, 246, 0.4)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
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
        <div className="absolute -top-2 -right-2 bg-pastel-purple text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-lg">
          {display.level}
        </div>
      </motion.div>
      
      {/* 이름 태그 */}
      <motion.div
        className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-black/80 to-black/60 text-white px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap shadow-xl backdrop-blur-sm border border-white/30"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {display.name}
      </motion.div>
      
      {/* 성장 단계 표시 */}
      {display.growthStage !== 'egg' && (
        <motion.div
          className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs text-gray-700 font-medium bg-white/90 px-3 py-1 rounded-full shadow-lg"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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

