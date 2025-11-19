import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Spiritling } from '../types'
import { useSpiritlingStore } from '../stores/spiritlingStore'

interface SpiritlingListProps {
  spiritlings: Spiritling[]
  onSpiritlingSelect?: (spiritling: Spiritling) => void
  readOnly?: boolean
}

export default function SpiritlingList({ spiritlings, onSpiritlingSelect, readOnly = false }: SpiritlingListProps) {
  const { setSelectedSpiritling, selectedSpiritling, createSpiritling, fetchSpiritlings } = useSpiritlingStore()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', element: 'fire', personality: '활발' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const handleSpiritlingClick = (spiritling: Spiritling) => {
    if (onSpiritlingSelect) {
      onSpiritlingSelect(spiritling)
    } else {
      setSelectedSpiritling(spiritling)
    }
  }

  const handleCreateClick = () => {
    setShowCreateForm(true)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setError('이름을 입력해주세요.')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      await createSpiritling(formData)
      await fetchSpiritlings()
      setShowCreateForm(false)
      setFormData({ name: '', element: 'fire', personality: '활발' })
    } catch (err: any) {
      console.error('마정령 생성 실패:', err)
      setError(err.response?.data?.detail || '마정령 생성에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const elements = [
    { value: 'fire', label: '불', emoji: '🔥' },
    { value: 'water', label: '물', emoji: '💧' },
    { value: 'earth', label: '땅', emoji: '🌍' },
    { value: 'air', label: '바람', emoji: '💨' },
    { value: 'light', label: '빛', emoji: '✨' },
    { value: 'dark', label: '어둠', emoji: '🌙' },
  ]

  const personalities = ['활발', '조용', '장난꾸러기', '차분', '호기심많음', '용감', '부끄러움', '친근함']

  if (spiritlings.length === 0 && !showCreateForm) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">마정령이 없습니다</p>
        <button className="btn-primary" onClick={handleCreateClick}>
          새 마정령 만들기
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {!readOnly && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleCreateClick}
          className="w-full btn-primary mb-4"
        >
          + 새 마정령 만들기
        </motion.button>
      )}

      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card mb-4"
          >
            <h3 className="text-xl font-bold mb-4">새 마정령 만들기</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">이름</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-purple"
                  placeholder="마정령 이름을 입력하세요"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">속성</label>
                <div className="grid grid-cols-3 gap-2">
                  {elements.map((elem) => (
                    <button
                      key={elem.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, element: elem.value })}
                      className={`px-4 py-2 border rounded-lg transition-all ${
                        formData.element === elem.value
                          ? 'bg-pastel-purple text-white border-pastel-purple'
                          : 'hover:bg-gray-50'
                      }`}
                      disabled={isLoading}
                    >
                      {elem.emoji} {elem.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">성격</label>
                <select
                  value={formData.personality}
                  onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-purple"
                  disabled={isLoading}
                >
                  {personalities.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? '생성 중...' : '생성하기'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    setError('')
                    setFormData({ name: '', element: 'fire', personality: '활발' })
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  disabled={isLoading}
                >
                  취소
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

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

