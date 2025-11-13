import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useItemStore } from '../stores/itemStore'
import { useAuthStore } from '../stores/authStore'
import { Item } from '../types'

export default function ItemShop() {
  const { items, fetchItems, buyItem } = useItemStore()
  const { user, fetchCurrentUser } = useAuthStore()
  const [buyingItemId, setBuyingItemId] = useState<string | null>(null)

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleBuy = async (item: Item) => {
    try {
      setBuyingItemId(item.id)
      await buyItem(item.id, 1)
      await fetchCurrentUser()
      alert(`${item.name}을(를) 구매했습니다!`)
    } catch (error: any) {
      alert(error.response?.data?.detail || '구매에 실패했습니다.')
    } finally {
      setBuyingItemId(null)
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h3 className="text-lg sm:text-xl font-bold mb-4">아이템 상점</h3>
      <div className="mb-4 p-2 sm:p-3 bg-pastel-purple/20 rounded-xl">
        <p className="text-xs sm:text-sm font-medium">보유 코인: <span className="text-pastel-purple font-bold">{user?.coins || 0}</span></p>
      </div>
      
      <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-3 sm:p-4 border-2 border-gray-200 rounded-xl hover:border-pastel-purple transition-all relative overflow-hidden group"
          >
            {/* 희귀도에 따른 빛나는 효과 */}
            {item.rarity === 'legendary' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-yellow-300/20 to-yellow-400/20"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
            )}
            {item.rarity === 'epic' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 4,
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
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  >
                    {getTypeIcon(item.type)}
                  </motion.span>
                  <h4 className="font-bold text-sm sm:text-base truncate">{item.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 font-medium ${getRarityColor(item.rarity)} ${
                    item.rarity === 'legendary' ? 'animate-pulse' : ''
                  }`}>
                    {item.rarity === 'common' && '일반'}
                    {item.rarity === 'rare' && '희귀'}
                    {item.rarity === 'epic' && '영웅'}
                    {item.rarity === 'legendary' && '전설'}
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
              <div className="w-full sm:w-auto sm:ml-4 sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-base sm:text-lg">💰</span>
                  <p className="font-bold text-pastel-purple text-sm sm:text-base">{item.price}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBuy(item)}
                  disabled={buyingItemId === item.id || (user?.coins || 0) < item.price}
                  className="btn-primary text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed py-2 px-3 sm:px-6 flex-shrink-0"
                >
                  {buyingItemId === item.id ? '구매 중...' : '🛒 구매'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

