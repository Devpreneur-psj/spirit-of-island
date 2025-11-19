import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { locations, Location, getUnlockedLocations } from '../config/locations'

interface WorldMapViewProps {
  onLocationClick: (location: Location) => void
  currentTab?: string
}

export default function WorldMapView({ onLocationClick, currentTab }: WorldMapViewProps) {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)
  const unlockedLocations = getUnlockedLocations()

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

      {/* 장소들 */}
      {unlockedLocations.map((location) => {
        const isActive = currentTab === location.tab
        const isHovered = hoveredLocation === location.id
        const isLocked = location.unlocked === false

        return (
          <motion.div
            key={location.id}
            className="absolute cursor-pointer group"
            style={getLocationStyle(location)}
            onHoverStart={() => setHoveredLocation(location.id)}
            onHoverEnd={() => setHoveredLocation(null)}
            onClick={() => handleLocationClick(location)}
            whileHover={{ scale: 1.2, zIndex: 10 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: isLocked ? 0.5 : 1,
              scale: isActive ? 1.15 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {/* 장소 아이콘 */}
            <div
              className={`
                relative w-16 h-16 sm:w-20 sm:h-20 rounded-full
                bg-gradient-to-br ${location.color}
                flex items-center justify-center
                shadow-lg
                ${isActive ? 'ring-4 ring-pastel-purple ring-offset-2' : ''}
                ${isHovered ? 'shadow-2xl' : ''}
                ${isLocked ? 'grayscale opacity-50' : ''}
                transition-all duration-300
              `}
            >
              <span className="text-3xl sm:text-4xl">{location.emoji}</span>
              
              {/* 펄스 효과 (활성화된 장소) */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-pastel-purple to-pastel-pink opacity-50"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </div>

            {/* 장소 이름 툴팁 */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs sm:text-sm rounded-lg whitespace-nowrap z-20 shadow-xl"
                >
                  <div className="font-bold">{location.name}</div>
                  <div className="text-gray-300 text-xs mt-1">{location.description}</div>
                  {isLocked && location.level && (
                    <div className="text-yellow-300 text-xs mt-1">
                      레벨 {location.level} 필요
                    </div>
                  )}
                  {/* 화살표 */}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}

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

