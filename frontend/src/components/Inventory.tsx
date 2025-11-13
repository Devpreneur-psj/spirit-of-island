import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useItemStore } from '../stores/itemStore'
import { useSpiritlingStore } from '../stores/spiritlingStore'
import { UserItem } from '../services/itemService'

export default function Inventory() {
  const { userItems, fetchUserItems, useItem } = useItemStore()
  const { selectedSpiritling, fetchSpiritlings, setSelectedSpiritling } = useSpiritlingStore()
  const [usingItemId, setUsingItemId] = useState<string | null>(null)

  useEffect(() => {
    fetchUserItems()
  }, [fetchUserItems])

  const handleUse = async (item: UserItem) => {
    if (!selectedSpiritling) {
      alert('마정령을 선택해주세요.')
      return
    }

    try {
      setUsingItemId(item.id)
      const result = await useItem(item.item_id, selectedSpiritling.id, 1)
      // 마정령 목록 새로고침
      await fetchSpiritlings()
      // 아이템 사용 후 업데이트된 마정령 정보가 있으면 선택된 마정령 업데이트
      if (result?.spiritling) {
        setSelectedSpiritling(result.spiritling)
      }
      alert(`${item.name}을(를) 사용했습니다!`)
    } catch (error: any) {
      alert(error.response?.data?.detail || '사용에 실패했습니다.')
    } finally {
      setUsingItemId(null)
    }
  }

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: 'bg-gray-200 text-gray-800',
      rare: 'bg-blue-200 text-blue-800',
      epic: 'bg-purple-200 text-purple-800',
      legendary: 'bg-yellow-200 text-yellow-800',
    }
    return colors[rarity] || colors.common
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      food: '🍽️',
      vitamin: '💊',
      toy: '🎮',
      medicine: '🏥',
      accessory: '⚡',
    }
    return icons[type] || '📦'
  }

  if (userItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-xl font-bold mb-4">인벤토리</h3>
        <p className="text-gray-500 text-center py-8">보유한 아이템이 없습니다.</p>
      </motion.div>
    )
  }

  return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg sm:text-xl font-bold mb-4">인벤토리</h3>
        <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
          {userItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="p-3 sm:p-4 border-2 border-gray-200 rounded-xl hover:border-pastel-purple transition-all relative overflow-hidden group"
            >
              {/* 수량이 많을 때 빛나는 효과 */}
              {item.quantity >= 10 && (
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              )}
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <motion.span 
                      className="text-xl sm:text-2xl flex-shrink-0"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    >
                      {getTypeIcon(item.type)}
                    </motion.span>
                    <h4 className="font-bold text-sm sm:text-base truncate">{item.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 font-medium ${getRarityColor(item.rarity)}`}>
                      {item.rarity === 'common' && '일반'}
                      {item.rarity === 'rare' && '희귀'}
                      {item.rarity === 'epic' && '영웅'}
                      {item.rarity === 'legendary' && '전설'}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                      ✨ x{item.quantity}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  <div className="text-xs sm:text-sm flex flex-wrap gap-2">
                    {item.effect.stat && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">📈 스탯: {item.effect.stat} +{item.effect.value}</span>
                    )}
                    {item.effect.status && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">💚 상태: {item.effect.status} +{item.effect.value}</span>
                    )}
                  </div>
                </div>
                <div className="w-full sm:w-auto sm:ml-4">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUse(item)}
                    disabled={usingItemId === item.id || !selectedSpiritling}
                    className="btn-primary text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed py-2 px-3 sm:px-4 w-full sm:w-auto flex items-center justify-center gap-1"
                  >
                    {usingItemId === item.id ? (
                      <>⏳ 사용 중...</>
                    ) : (
                      <>✨ 사용</>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

