import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FriendForVillage, Spiritling } from '../types'
import { villageService } from '../services/villageService'
import SpiritlingProfile from './SpiritlingProfile'
import VillageCanvas from './VillageCanvas'
import { useSpiritlingStore } from '../stores/spiritlingStore'

interface UserProfile {
  id: string
  username: string
  email: string
  coins: number
  created_at?: string
}

export default function VillageView() {
  const { spiritlings, fetchSpiritlings } = useSpiritlingStore()
  const [friends, setFriends] = useState<FriendForVillage[]>([])
  const [selectedFriend, setSelectedFriend] = useState<FriendForVillage | null>(null)
  const [friendSpiritlings, setFriendSpiritlings] = useState<Spiritling[]>([])
  const [friendProfile, setFriendProfile] = useState<UserProfile | null>(null)
  const [selectedSpiritling, setSelectedSpiritling] = useState<Spiritling | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'my-village' | 'friend-visit'>('my-village')

  useEffect(() => {
    fetchSpiritlings()
    fetchFriends()
  }, [fetchSpiritlings])

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
      {/* 뷰 모드 전환 탭 */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setViewMode('my-village')}
          className={`px-4 py-2 font-medium transition-colors ${
            viewMode === 'my-village'
              ? 'text-pastel-purple border-b-2 border-pastel-purple'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          내 마을
        </button>
        <button
          onClick={() => setViewMode('friend-visit')}
          className={`px-4 py-2 font-medium transition-colors ${
            viewMode === 'friend-visit'
              ? 'text-pastel-purple border-b-2 border-pastel-purple'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          친구 마을 방문
        </button>
      </div>

      {/* 내 마을 뷰 */}
      {viewMode === 'my-village' && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-xl font-bold mb-4">내 마을</h3>
            <p className="text-sm text-gray-600 mb-4">
              정령들을 드래그하여 마을에 배치하세요. 정령을 클릭하면 상태를 확인할 수 있습니다.
            </p>
            {spiritlings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">마정령이 없습니다.</p>
                <p className="text-sm text-gray-400">마정령을 생성하면 마을에 나타납니다.</p>
              </div>
            ) : (
              <VillageCanvas
                spiritlings={spiritlings}
                onSpiritlingClick={setSelectedSpiritling}
              />
            )}
          </div>
        </div>
      )}

      {/* 친구 마을 방문 뷰 */}
      {viewMode === 'friend-visit' && !selectedFriend ? (
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
      ) : viewMode === 'friend-visit' && selectedFriend ? (
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

          {/* 친구 마을 캔버스 (읽기 전용) */}
          {friendSpiritlings.length === 0 ? (
            <div className="card">
              <p className="text-gray-500 text-center py-12">마정령이 없습니다.</p>
            </div>
          ) : (
            <div className="card">
              <VillageCanvas
                spiritlings={friendSpiritlings}
                onSpiritlingClick={setSelectedSpiritling}
              />
            </div>
          )}

          {/* 선택된 마정령 상세 정보 */}
          {selectedSpiritling && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">마정령 정보</h3>
                <button
                  onClick={() => setSelectedSpiritling(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <SpiritlingProfile spiritling={selectedSpiritling} />
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

