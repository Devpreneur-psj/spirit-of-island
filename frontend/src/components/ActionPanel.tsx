import { useState } from 'react'
import { motion } from 'framer-motion'
import { Spiritling, toDisplayFormat } from '../types'
import { useSpiritlingStore } from '../stores/spiritlingStore'

interface ActionPanelProps {
  spiritling: Spiritling
}

export default function ActionPanel({ spiritling }: ActionPanelProps) {
  const { feedSpiritling, playWithSpiritling, healSpiritling, cleanSpiritling, trainSpiritling } = useSpiritlingStore()
  const [isTraining, setIsTraining] = useState(false)
  const [selectedStat, setSelectedStat] = useState<string>('')
  const display = toDisplayFormat(spiritling)

  const handleFeed = async () => {
    try {
      await feedSpiritling(spiritling.id)
    } catch (error) {
      alert('먹이 주기에 실패했습니다.')
    }
  }

  const handlePlay = async () => {
    try {
      await playWithSpiritling(spiritling.id)
    } catch (error) {
      alert('놀기 실패했습니다.')
    }
  }

  const handleHeal = async () => {
    try {
      await healSpiritling(spiritling.id)
    } catch (error) {
      alert('치료에 실패했습니다.')
    }
  }

  const handleClean = async () => {
    try {
      await cleanSpiritling(spiritling.id)
    } catch (error) {
      alert('씻기기에 실패했습니다.')
    }
  }

  const handleTrain = async () => {
    if (!selectedStat) {
      alert('훈련할 스탯을 선택해주세요.')
      return
    }
    try {
      setIsTraining(true)
      await trainSpiritling(spiritling.id, selectedStat)
      setIsTraining(false)
      setSelectedStat('')
    } catch (error: any) {
      setIsTraining(false)
      alert(error.response?.data?.detail || '훈련에 실패했습니다.')
    }
  }

  const statOptions = [
    { value: 'health', label: '체력', icon: '❤️' },
    { value: 'agility', label: '민첩', icon: '⚡' },
    { value: 'intelligence', label: '지능', icon: '🧠' },
    { value: 'friendliness', label: '친근함', icon: '😊' },
    { value: 'resilience', label: '근성', icon: '💪' },
    { value: 'luck', label: '운', icon: '🍀' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card space-y-4"
    >
      <h3 className="text-lg sm:text-xl font-bold">행동</h3>
      
      {/* 기본 행동 */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFeed}
          className="btn-primary flex flex-col items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm py-3 sm:py-4 relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2"
          aria-label="마정령에게 먹이 주기"
        >
          <motion.span 
            className="text-2xl sm:text-3xl z-10 relative"
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            🍽️
          </motion.span>
          <span className="z-10 relative hidden sm:inline">먹이주기</span>
          <span className="z-10 relative sm:hidden">먹이</span>
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.5 }}
          />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlay}
          className="btn-primary flex flex-col items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm py-3 sm:py-4 relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2"
          aria-label="마정령과 놀기"
        >
          <motion.span 
            className="text-2xl sm:text-3xl z-10 relative"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            🎮
          </motion.span>
          <span className="z-10 relative hidden sm:inline">놀기</span>
          <span className="z-10 relative sm:hidden">놀기</span>
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.5 }}
          />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleHeal}
          className="btn-secondary flex flex-col items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm py-3 sm:py-4 relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2"
          aria-label="마정령 치료하기"
        >
          <motion.span 
            className="text-2xl sm:text-3xl z-10 relative"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 2.5,
            }}
          >
            💊
          </motion.span>
          <span className="z-10 relative hidden sm:inline">치료</span>
          <span className="z-10 relative sm:hidden">치료</span>
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.5 }}
          />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClean}
          className="btn-secondary flex flex-col items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm py-3 sm:py-4 relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2"
          aria-label="마정령 씻기기"
        >
          <motion.span 
            className="text-2xl sm:text-3xl z-10 relative"
            animate={{
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            🛁
          </motion.span>
          <span className="z-10 relative hidden sm:inline">씻기기</span>
          <span className="z-10 relative sm:hidden">씻기</span>
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.5 }}
          />
        </motion.button>
      </div>

      {/* 훈련 */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="font-bold mb-2 text-sm sm:text-base">훈련</h4>
        <div className="space-y-2">
          <select
            value={selectedStat}
            onChange={(e) => setSelectedStat(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-pastel-purple focus:border-transparent outline-none"
            aria-label="훈련할 스탯 선택"
          >
            <option value="">스탯 선택</option>
            {statOptions.map((stat) => (
              <option key={stat.value} value={stat.value}>
                {stat.icon} {stat.label}
              </option>
            ))}
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTrain}
            disabled={!selectedStat || isTraining || display.status.energy < 20}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2"
            aria-label={`마정령 훈련하기 ${selectedStat ? `(${selectedStat})` : ''}`}
            aria-disabled={!selectedStat || isTraining || display.status.energy < 20}
          >
            {isTraining ? '훈련 중...' : <><span className="hidden sm:inline">훈련하기 (에너지 -20)</span><span className="sm:hidden">훈련</span></>}
          </motion.button>
          {display.status.energy < 20 && (
            <p className="text-xs sm:text-sm text-red-500">에너지가 부족합니다. (현재: {display.status.energy}/100)</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

