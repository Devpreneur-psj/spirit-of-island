import { motion } from 'framer-motion'
import { Spiritling } from '../types'
import { useSpiritlingStore } from '../stores/spiritlingStore'

interface SpiritlingListProps {
  spiritlings: Spiritling[]
  onSpiritlingSelect?: (spiritling: Spiritling) => void
  readOnly?: boolean
}

export default function SpiritlingList({ spiritlings, onSpiritlingSelect, readOnly = false }: SpiritlingListProps) {
  const { setSelectedSpiritling, selectedSpiritling } = useSpiritlingStore()
  
  const handleSpiritlingClick = (spiritling: Spiritling) => {
    if (onSpiritlingSelect) {
      onSpiritlingSelect(spiritling)
    } else {
      setSelectedSpiritling(spiritling)
    }
  }

  if (spiritlings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">마정령이 없습니다</p>
        <button className="btn-primary">새 마정령 만들기</button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {spiritlings.map((spiritling, index) => (
        <motion.button
          key={spiritling.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSpiritlingClick(spiritling)}
          className={`w-full card text-left transition-all relative overflow-hidden ${
            selectedSpiritling?.id === spiritling.id
              ? 'ring-2 ring-pastel-purple bg-pastel-purple/10 shadow-lg'
              : ''
          }`}
        >
          {/* 호버 시 배경 효과 */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-pastel-purple/10 to-pastel-pink/10"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.5 }}
          />
          
          <div className="flex items-center justify-between gap-2 relative z-10">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-sm sm:text-base truncate">{spiritling.name}</h4>
                {spiritling.level >= 10 && (
                  <span className="text-xs bg-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded-full font-medium">
                    ⭐
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {spiritling.element} · 레벨 {spiritling.level}
              </p>
            </div>
            <motion.div 
              className="text-2xl sm:text-3xl flex-shrink-0"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              {spiritling.element === 'fire' && '🔥'}
              {spiritling.element === 'water' && '💧'}
              {spiritling.element === 'wind' && '🌪️'}
              {spiritling.element === 'earth' && '🌍'}
              {spiritling.element === 'plant' && '🌱'}
              {spiritling.element === 'electric' && '⚡'}
              {spiritling.element === 'light' && '✨'}
              {spiritling.element === 'dark' && '🌙'}
            </motion.div>
          </div>
        </motion.button>
      ))}
    </div>
  )
}

