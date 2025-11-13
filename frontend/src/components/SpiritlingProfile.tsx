import { motion } from 'framer-motion'
import { Spiritling, toDisplayFormat } from '../types'

interface SpiritlingProfileProps {
  spiritling: Spiritling
}

export default function SpiritlingProfile({ spiritling }: SpiritlingProfileProps) {
  const display = toDisplayFormat(spiritling)
  const getElementColor = (element: string) => {
    const colors: Record<string, string> = {
      fire: 'text-red-500',
      water: 'text-blue-500',
      wind: 'text-green-500',
      earth: 'text-yellow-600',
      plant: 'text-green-600',
      electric: 'text-yellow-500',
      light: 'text-yellow-300',
      dark: 'text-gray-600',
    }
    return colors[element] || 'text-gray-500'
  }

  const getStatusColor = (value: number) => {
    if (value >= 70) return 'bg-green-400'
    if (value >= 40) return 'bg-yellow-400'
    return 'bg-red-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-xl sm:text-2xl font-bold">{display.name}</h2>
        <span className={`text-xs sm:text-sm font-medium ${getElementColor(display.element)}`}>
          {display.element}
        </span>
      </div>

      <div className="space-y-4">
        {/* 상태 바 */}
        <div>
          <div className="flex justify-between text-xs sm:text-sm mb-1.5">
            <span className="flex items-center gap-1.5">
              <span>🍽️</span>
              <span>배고픔</span>
            </span>
            <span className="font-medium">{display.status.hunger}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${getStatusColor(display.status.hunger)} relative`}
              initial={{ width: 0 }}
              animate={{ width: `${display.status.hunger}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* 반짝이는 효과 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            </motion.div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs sm:text-sm mb-1.5">
            <span className="flex items-center gap-1.5">
              <span>😊</span>
              <span>행복도</span>
            </span>
            <span className="font-medium">{display.status.happiness}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${getStatusColor(display.status.happiness)} relative`}
              initial={{ width: 0 }}
              animate={{ width: `${display.status.happiness}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1.2,
                }}
              />
            </motion.div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs sm:text-sm mb-1.5">
            <span className="flex items-center gap-1.5">
              <span>⚡</span>
              <span>에너지</span>
            </span>
            <span className="font-medium">{display.status.energy}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${getStatusColor(display.status.energy)} relative`}
              initial={{ width: 0 }}
              animate={{ width: `${display.status.energy}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1.4,
                }}
              />
            </motion.div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs sm:text-sm mb-1.5">
            <span className="flex items-center gap-1.5">
              <span>💚</span>
              <span>건강</span>
            </span>
            <span className="font-medium">{display.status.health}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${getStatusColor(display.status.health)} relative`}
              initial={{ width: 0 }}
              animate={{ width: `${display.status.health}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1.6,
                }}
              />
            </motion.div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs sm:text-sm mb-1.5">
            <span className="flex items-center gap-1.5">
              <span>✨</span>
              <span>청결도</span>
            </span>
            <span className="font-medium">{display.status.cleanliness}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${getStatusColor(display.status.cleanliness)} relative`}
              initial={{ width: 0 }}
              animate={{ width: `${display.status.cleanliness}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1.8,
                }}
              />
            </motion.div>
          </div>
        </div>

          {/* 스탯 */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-bold mb-3 text-sm sm:text-base flex items-center gap-2">
              <span>📊</span>
              <span>스탯</span>
            </h3>
            
            {/* 레벨 및 경험치 */}
            <div className="mb-3 p-3 bg-pastel-purple/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-medium">레벨 {display.level}</span>
                <span className="text-xs sm:text-sm text-gray-600">
                  경험치: {display.experience}/{display.level * 100}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pastel-purple to-pastel-pink rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(display.experience / (display.level * 100)) * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
            
            {/* 성장 단계 */}
            <div className="mb-3 p-2 bg-pastel-blue/20 rounded-lg text-center">
              <span className="text-xs sm:text-sm text-gray-600">성장 단계: </span>
              <span className="font-medium text-pastel-purple text-sm sm:text-base">
                {display.growthStage === 'egg' && '🥚 알'}
                {display.growthStage === 'infant' && '👶 유아'}
                {display.growthStage === 'adolescent' && '🧒 청소년'}
                {display.growthStage === 'adult' && '👤 성체'}
                {display.growthStage === 'transcendent' && '✨ 초월체'}
                {display.growthStage === 'elder' && '👴 노년'}
              </span>
            </div>
            
            {/* 능력치 그리드 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
              <motion.div 
                className="p-2 bg-blue-50 rounded-lg text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-base sm:text-lg mb-1">❤️</div>
                <div className="font-medium">체력</div>
                <div className="text-pastel-purple font-bold">{display.stats.health}</div>
              </motion.div>
              <motion.div 
                className="p-2 bg-green-50 rounded-lg text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-base sm:text-lg mb-1">⚡</div>
                <div className="font-medium">민첩</div>
                <div className="text-pastel-purple font-bold">{display.stats.agility}</div>
              </motion.div>
              <motion.div 
                className="p-2 bg-yellow-50 rounded-lg text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-base sm:text-lg mb-1">🧠</div>
                <div className="font-medium">지능</div>
                <div className="text-pastel-purple font-bold">{display.stats.intelligence}</div>
              </motion.div>
              <motion.div 
                className="p-2 bg-pink-50 rounded-lg text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-base sm:text-lg mb-1">😊</div>
                <div className="font-medium">친근함</div>
                <div className="text-pastel-purple font-bold">{display.stats.friendliness}</div>
              </motion.div>
              <motion.div 
                className="p-2 bg-orange-50 rounded-lg text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-base sm:text-lg mb-1">💪</div>
                <div className="font-medium">근성</div>
                <div className="text-pastel-purple font-bold">{display.stats.resilience}</div>
              </motion.div>
              <motion.div 
                className="p-2 bg-purple-50 rounded-lg text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-base sm:text-lg mb-1">🍀</div>
                <div className="font-medium">운</div>
                <div className="text-pastel-purple font-bold">{display.stats.luck}</div>
              </motion.div>
            </div>
          </div>
      </div>
    </motion.div>
  )
}

