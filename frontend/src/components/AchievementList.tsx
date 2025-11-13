import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { achievementService, Achievement, UserAchievement } from '../services/achievementService'

export default function AchievementList() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchAchievements()
    fetchUserAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      setIsLoading(true)
      const data = await achievementService.getAchievements()
      setAchievements(data)
    } catch (error) {
      console.error('Failed to fetch achievements:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserAchievements = async () => {
    try {
      const data = await achievementService.getMyAchievements()
      setUserAchievements(data)
    } catch (error) {
      console.error('Failed to fetch user achievements:', error)
    }
  }

  const handleClaim = async (achievementId: string) => {
    try {
      await achievementService.claimAchievement(achievementId)
      alert('보상을 받았습니다!')
      fetchUserAchievements()
    } catch (error: any) {
      alert(error.response?.data?.detail || '보상 받기에 실패했습니다.')
    }
  }

  const getUserAchievement = (achievementId: string) => {
    return userAchievements.find(ua => ua.achievement_id === achievementId)
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      level: '📈',
      collection: '🦄',
      stat: '💪',
      coins: '💰',
      battle: '⚔️',
      social: '👥',
    }
    return icons[category] || '🏆'
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg sm:text-xl font-bold mb-4">업적</h3>
        
        {isLoading ? (
          <p className="text-gray-500 text-center py-4 text-sm">로딩 중...</p>
        ) : achievements.length === 0 ? (
          <p className="text-gray-500 text-center py-4 text-sm">업적이 없습니다.</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {achievements.map((achievement, index) => {
              const userAchievement = getUserAchievement(achievement.id)
              const isCompleted = userAchievement?.completed === 'true'
              const canClaim = isCompleted && userAchievement && achievement.reward_coins > 0
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border-2 ${
                    isCompleted
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{achievement.icon || getCategoryIcon(achievement.category)}</span>
                        <h4 className="font-bold text-sm sm:text-base truncate">{achievement.name}</h4>
                        {isCompleted && (
                          <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">
                            완료
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                        {achievement.description}
                      </p>
                      <div className="text-xs sm:text-sm text-gray-500 mb-2">
                        카테고리: {achievement.category}
                      </div>
                      {userAchievement && (
                        <div className="text-xs sm:text-sm text-gray-600">
                          진행 상황: {JSON.stringify(userAchievement.progress)}
                        </div>
                      )}
                      {achievement.reward_coins > 0 && (
                        <div className="text-xs sm:text-sm text-pastel-purple font-medium mt-2">
                          보상: {achievement.reward_coins} 코인
                        </div>
                      )}
                    </div>
                    {canClaim && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleClaim(achievement.id)}
                        className="btn-primary text-xs sm:text-sm py-2 px-3 sm:px-4 flex-shrink-0"
                      >
                        보상 받기
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

