import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FriendForVillage, Spiritling } from '../types'
import { villageService } from '../services/villageService'
import SpiritlingProfile from './SpiritlingProfile'

interface UserProfile {
  id: string
  username: string
  email: string
  coins: number
  created_at?: string
}

export default function VillageView() {
  const [friends, setFriends] = useState<FriendForVillage[]>([])
  const [selectedFriend, setSelectedFriend] = useState<FriendForVillage | null>(null)
  const [friendSpiritlings, setFriendSpiritlings] = useState<Spiritling[]>([])
  const [friendProfile, setFriendProfile] = useState<UserProfile | null>(null)
  const [selectedSpiritling, setSelectedSpiritling] = useState<Spiritling | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchFriends()
  }, [])

  useEffect(() => {
    if (selectedFriend) {
      fetchFriendProfile(selectedFriend.id)
      fetchFriendSpiritlings(selectedFriend.id)
    }
  }, [selectedFriend])

  const fetchFriends = async () => {
    try {
      setIsLoading(true)
      const data = await villageService.getFriendsForVillage()
      setFriends(data)
    } catch (error) {
      console.error('Failed to fetch friends:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFriendProfile = async (userId: string) => {
    try {
      const data = await villageService.getUserProfile(userId) as UserProfile
      setFriendProfile(data)
    } catch (error: any) {
      console.error('Failed to fetch friend profile:', error)
      // 프로필 로드 실패는 경고만 (필수는 아님)
    }
  }

  const fetchFriendSpiritlings = async (userId: string) => {
    try {
      setIsLoading(true)
      const data = await villageService.getUserSpiritlings(userId)
      setFriendSpiritlings(data)
      setSelectedSpiritling(null) // 초기화
    } catch (error: any) {
      console.error('Failed to fetch friend spiritlings:', error)
      alert(error.response?.data?.detail || '마정령 목록을 불러올 수 없습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFriendSelect = (friend: FriendForVillage) => {
    setSelectedFriend(friend)
    setSelectedSpiritling(null)
  }

  const handleSpiritlingSelect = (spiritling: Spiritling) => {
    setSelectedSpiritling(spiritling)
  }

  const handleBack = () => {
    setSelectedFriend(null)
    setSelectedSpiritling(null)
    setFriendProfile(null)
    setFriendSpiritlings([])
  }

  return (
    <div className="space-y-6">
      {!selectedFriend ? (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">마을 방문</h3>
          <p className="text-sm text-gray-600 mb-4">친구의 마정령을 방문하여 구경할 수 있습니다.</p>
          {isLoading ? (
            <p className="text-gray-500 text-center py-4">로딩 중...</p>
          ) : friends.length === 0 ? (
            <p className="text-gray-500 text-center py-4">친구가 없습니다. 친구를 추가하여 마을을 방문해보세요!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friend) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleFriendSelect(friend)}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-pastel-purple rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {friend.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{friend.username}</p>
                      <p className="text-sm text-gray-500">{friend.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>🦄 마정령</span>
                    <span className="font-bold text-pastel-purple">{friend.spiritling_count}마리</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* 친구 프로필 헤더 */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleBack}
                  className="text-xl sm:text-2xl hover:text-pastel-purple transition-colors flex-shrink-0 min-w-[32px] min-h-[32px] flex items-center justify-center"
                  aria-label="뒤로가기"
                >
                  ←
                </motion.button>
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pastel-purple rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl flex-shrink-0">
                    {selectedFriend.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-2xl font-bold truncate">{selectedFriend.username}의 마을</h3>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{selectedFriend.email}</p>
                    {friendProfile && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        코인: <span className="font-bold text-pastel-purple">{friendProfile.coins}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 마정령 목록 또는 선택된 마정령 */}
          {selectedSpiritling ? (
            <div className="space-y-6">
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSpiritling(null)}
                className="btn-secondary text-xs sm:text-sm py-2 px-3 sm:px-6"
              >
                ← 마정령 목록으로
              </motion.button>
              <SpiritlingProfile spiritling={selectedSpiritling} />
            </div>
          ) : (
            <div className="card">
              <h3 className="text-xl font-bold mb-4">마정령 목록</h3>
              {isLoading ? (
                <p className="text-gray-500 text-center py-4">로딩 중...</p>
              ) : friendSpiritlings.length === 0 ? (
                <p className="text-gray-500 text-center py-4">마정령이 없습니다.</p>
              ) : (
                <div className="space-y-2">
                  {friendSpiritlings.map((spiritling) => (
                    <motion.button
                      key={spiritling.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSpiritlingSelect(spiritling)}
                      className={`w-full card text-left transition-all ${
                        selectedSpiritling?.id === spiritling.id
                          ? 'ring-2 ring-pastel-purple bg-pastel-purple/10'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold">{spiritling.name}</h4>
                          <p className="text-sm text-gray-600">
                            {spiritling.element} · 레벨 {spiritling.level}
                          </p>
                        </div>
                        <div className="text-2xl">
                          {spiritling.element === 'fire' && '🔥'}
                          {spiritling.element === 'water' && '💧'}
                          {spiritling.element === 'wind' && '🌪️'}
                          {spiritling.element === 'earth' && '🌍'}
                          {spiritling.element === 'plant' && '🌱'}
                          {spiritling.element === 'electric' && '⚡'}
                          {spiritling.element === 'light' && '✨'}
                          {spiritling.element === 'dark' && '🌙'}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

