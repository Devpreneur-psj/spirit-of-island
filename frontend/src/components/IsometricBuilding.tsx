import { motion } from 'framer-motion'
import { Location } from '../config/locations'

interface IsometricBuildingProps {
  location: Location
  isHovered: boolean
  isUnlocked: boolean
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export default function IsometricBuilding({
  location,
  isHovered,
  isUnlocked,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: IsometricBuildingProps) {
  // 이소메트릭 변환 (2.5D 효과)
  const isometricTransform = {
    transform: 'rotateX(60deg) rotateZ(-45deg)',
    transformStyle: 'preserve-3d' as const,
  }

  const getBuildingSize = () => {
    switch (location.category) {
      case 'home':
        return 'w-16 h-16'
      case 'shop':
        return 'w-14 h-14'
      case 'activity':
        return 'w-18 h-18'
      case 'special':
        return 'w-20 h-20'
      default:
        return 'w-16 h-16'
    }
  }

  const getBuildingShadow = () => {
    return {
      filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))',
    }
  }

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `${location.position.x}%`,
        top: `${location.position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        scale: isHovered ? 1.15 : 1,
        y: isHovered ? -5 : 0,
      }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* 건물 본체 */}
      <div className="relative">
        {/* 그림자 */}
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-12 h-6 bg-black/20 rounded-full blur-sm"
          style={{ transform: 'translateX(-50%) translateY(50%) scaleX(1.5)' }}
        />
        
        {/* 건물 */}
        <motion.div
          className={`${getBuildingSize()} relative flex items-center justify-center rounded-lg ${
            isUnlocked
              ? `bg-gradient-to-br ${location.color}`
              : 'bg-gray-400 opacity-50'
          }`}
          style={{
            ...getBuildingShadow(),
            clipPath: 'polygon(0% 25%, 50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%)',
          }}
          animate={{
            rotateY: isHovered ? 5 : 0,
          }}
        >
          {/* 건물 지붕 효과 */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent"
            style={{
              clipPath: 'polygon(0% 25%, 50% 0%, 100% 25%, 100% 30%, 50% 5%, 0% 30%)',
            }}
          />
          
          {/* 아이콘 */}
          <div className="relative z-10 text-3xl">
            {location.emoji}
          </div>
          
          {/* 잠금 표시 */}
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <span className="text-2xl">🔒</span>
            </div>
          )}
        </motion.div>

        {/* 건물 기둥 (3D 효과) */}
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-black/10"
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)',
            transform: 'translateX(-50%) translateY(100%)',
          }}
        />
      </div>

      {/* 이름 라벨 */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap z-30"
        >
          {location.name}
          {!isUnlocked && location.level && (
            <div className="text-[10px] text-gray-300 mt-0.5">
              레벨 {location.level} 필요
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

