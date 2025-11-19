import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Spiritling } from '../types'
import { useSpiritlingStore } from '../stores/spiritlingStore'

interface SpiritlingPosition {
  spiritlingId: string
  x: number
  y: number
}

interface VillageCanvasProps {
  spiritlings: Spiritling[]
  onSpiritlingClick?: (spiritling: Spiritling) => void
}

export default function VillageCanvas({ spiritlings, onSpiritlingClick }: VillageCanvasProps) {
  const [positions, setPositions] = useState<Map<string, SpiritlingPosition>>(new Map())
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [selectedSpiritling, setSelectedSpiritling] = useState<Spiritling | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // 초기 위치 설정
  useEffect(() => {
    const initialPositions = new Map<string, SpiritlingPosition>()
    spiritlings.forEach((spiritling, index) => {
      if (!positions.has(spiritling.id)) {
        initialPositions.set(spiritling.id, {
          spiritlingId: spiritling.id,
          x: 20 + (index % 3) * 30,
          y: 30 + Math.floor(index / 3) * 25,
        })
      } else {
        initialPositions.set(spiritling.id, positions.get(spiritling.id)!)
      }
    })
    setPositions(initialPositions)
  }, [spiritlings])

  const handleMouseDown = useCallback((e: React.MouseEvent, spiritlingId: string) => {
    e.preventDefault()
    setDraggingId(spiritlingId)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggingId || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setPositions(prev => {
      const newPositions = new Map(prev)
      const current = newPositions.get(draggingId)
      if (current) {
        newPositions.set(draggingId, {
          ...current,
          x: Math.max(5, Math.min(95, x)),
          y: Math.max(5, Math.min(95, y)),
        })
      }
      return newPositions
    })
  }, [draggingId])

  const handleMouseUp = useCallback(() => {
    setDraggingId(null)
  }, [])

  const getSpiritlingEmoji = (spiritling: Spiritling) => {
    const elementEmojis: Record<string, string> = {
      fire: '🔥',
      water: '💧',
      earth: '🌍',
      air: '💨',
      light: '✨',
      dark: '🌙',
    }
    return elementEmojis[spiritling.element] || '🦄'
  }

  const getSpiritlingStatusEmoji = (spiritling: Spiritling) => {
    const action = spiritling.current_action || 'idle'
    const statusEmojis: Record<string, string> = {
      idle: '😊',
      playing: '🎮',
      eating: '🍽️',
      sleeping: '😴',
      training: '💪',
      exploring: '🔍',
      resting: '🧘',
    }
    return statusEmojis[action] || '😊'
  }

  const getSpiritlingSize = (spiritling: Spiritling) => {
    const level = spiritling.level || 1
    if (level >= 40) return 'text-6xl'
    if (level >= 25) return 'text-5xl'
    if (level >= 15) return 'text-4xl'
    if (level >= 5) return 'text-3xl'
    return 'text-2xl'
  }

  const handleSpiritlingClick = useCallback((spiritling: Spiritling) => {
    setSelectedSpiritling(spiritling)
    if (onSpiritlingClick) {
      onSpiritlingClick(spiritling)
    }
  }, [onSpiritlingClick])

  return (
    <div className="relative w-full h-full">
      {/* 마을 배경 캔버스 */}
      <div
        ref={canvasRef}
        className="relative w-full h-[600px] bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 rounded-2xl overflow-hidden shadow-inner"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* 배경 장식 요소들 */}
        <div className="absolute inset-0">
          {/* 하늘 */}
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-200 to-transparent opacity-50"></div>
          
          {/* 구름 */}
          <motion.div
            className="absolute top-10 left-10 text-4xl opacity-30"
            animate={{ x: [0, 20, 0], y: [0, 5, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          >
            ☁️
          </motion.div>
          <motion.div
            className="absolute top-20 right-20 text-3xl opacity-20"
            animate={{ x: [0, -15, 0], y: [0, 8, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          >
            ☁️
          </motion.div>

          {/* 나무 */}
          <div className="absolute bottom-0 left-10 text-6xl opacity-40">🌳</div>
          <div className="absolute bottom-0 right-20 text-5xl opacity-30">🌲</div>
          
          {/* 집 */}
          <div className="absolute bottom-10 left-1/4 text-5xl opacity-50">🏠</div>
          <div className="absolute bottom-10 right-1/4 text-4xl opacity-40">🏡</div>
        </div>

        {/* 정령들 */}
        {spiritlings.map((spiritling) => {
          const position = positions.get(spiritling.id)
          if (!position) return null

          const isDragging = draggingId === spiritling.id
          const size = getSpiritlingSize(spiritling)
          const elementEmoji = getSpiritlingEmoji(spiritling)
          const statusEmoji = getSpiritlingStatusEmoji(spiritling)

          return (
            <motion.div
              key={spiritling.id}
              className="absolute cursor-move select-none"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: isDragging ? 1.2 : 1,
                y: isDragging ? 0 : [0, -5, 0],
              }}
              transition={{
                y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                scale: { duration: 0.2 },
              }}
              onMouseDown={(e) => handleMouseDown(e, spiritling.id)}
              onClick={() => handleSpiritlingClick(spiritling)}
              whileHover={{ scale: 1.1 }}
            >
              {/* 정령 UI */}
              <div className="relative">
                {/* 정령 이모지 */}
                <div className={`${size} relative z-10`}>
                  {elementEmoji}
                </div>
                
                {/* 상태 이모지 (작은 배지) */}
                <motion.div
                  className="absolute -top-2 -right-2 text-xl bg-white rounded-full p-1 shadow-md"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {statusEmoji}
                </motion.div>

                {/* 이름 태그 */}
                <motion.div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-black/70 text-white text-xs rounded whitespace-nowrap"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {spiritling.name}
                  <span className="ml-1 text-[10px] opacity-75">Lv.{spiritling.level}</span>
                </motion.div>

                {/* 드래그 중 표시 */}
                {isDragging && (
                  <motion.div
                    className="absolute -inset-4 border-2 border-pastel-purple border-dashed rounded-full"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* 정령 상태창 모달 */}
      <AnimatePresence>
        {selectedSpiritling && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSpiritling(null)}
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedSpiritling(null)}
            />
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full z-10"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedSpiritling(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>

              <div className="text-center mb-4">
                <div className="text-6xl mb-2">
                  {getSpiritlingEmoji(selectedSpiritling)}
                </div>
                <h3 className="text-2xl font-bold">{selectedSpiritling.name}</h3>
                <p className="text-gray-600">
                  {selectedSpiritling.element} · 레벨 {selectedSpiritling.level}
                </p>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-sm text-gray-600">현재 상태</div>
                    <div className="text-lg font-bold text-purple-600">
                      {selectedSpiritling.current_action || 'idle'}
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600">경험치</div>
                    <div className="text-lg font-bold text-blue-600">
                      {selectedSpiritling.experience} / {selectedSpiritling.level * 100}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">배고픔</span>
                    <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${selectedSpiritling.hunger || 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{selectedSpiritling.hunger || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">행복도</span>
                    <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${selectedSpiritling.happiness || 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{selectedSpiritling.happiness || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">에너지</span>
                    <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${selectedSpiritling.energy || 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{selectedSpiritling.energy || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">건강</span>
                    <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${selectedSpiritling.health_status || 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{selectedSpiritling.health_status || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">청결도</span>
                    <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-cyan-500 h-2 rounded-full"
                        style={{ width: `${selectedSpiritling.cleanliness || 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{selectedSpiritling.cleanliness || 0}%</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="text-sm text-gray-600 mb-2">스탯</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>체력: {selectedSpiritling.health_stat}</div>
                    <div>민첩: {selectedSpiritling.agility_stat}</div>
                    <div>지능: {selectedSpiritling.intelligence_stat}</div>
                    <div>친근: {selectedSpiritling.friendliness_stat}</div>
                    <div>회복: {selectedSpiritling.resilience_stat}</div>
                    <div>운: {selectedSpiritling.luck_stat}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

