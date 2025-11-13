import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Friend, FriendRequest, SearchedUser } from '../types'
import { friendService } from '../services/friendService'
import { useAuthStore } from '../stores/authStore'

export default function FriendList() {
  const { user: currentUser } = useAuthStore()
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([])
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'friends') {
      fetchFriends()
    } else if (activeTab === 'requests') {
      fetchFriendRequests()
    }
  }, [activeTab])

  const fetchFriends = async () => {
    try {
      setIsLoading(true)
      const data = await friendService.getFriends()
      setFriends(data)
    } catch (error) {
      console.error('Failed to fetch friends:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFriendRequests = async () => {
    try {
      setIsLoading(true)
      const data = await friendService.getFriendRequests()
      setFriendRequests(data)
    } catch (error) {
      console.error('Failed to fetch friend requests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    try {
      setIsLoading(true)
      const data = await friendService.searchUsers(searchQuery)
      setSearchResults(data)
    } catch (error) {
      console.error('Failed to search users:', error)
      alert('사용자 검색에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendRequest = async (friendId: string) => {
    try {
      await friendService.sendFriendRequest(friendId)
      alert('친구 요청을 보냈습니다!')
      handleSearch()
    } catch (error: any) {
      alert(error.response?.data?.detail || '친구 요청에 실패했습니다.')
    }
  }

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await friendService.acceptFriendRequest(requestId)
      alert('친구 요청을 수락했습니다!')
      await fetchFriendRequests()
      await fetchFriends()
    } catch (error: any) {
      alert(error.response?.data?.detail || '친구 요청 수락에 실패했습니다.')
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      await friendService.rejectFriendRequest(requestId)
      alert('친구 요청을 거절했습니다.')
      await fetchFriendRequests()
    } catch (error: any) {
      alert(error.response?.data?.detail || '친구 요청 거절에 실패했습니다.')
    }
  }

  const handleRemoveFriend = async (friendId: string) => {
    if (!confirm('정말 친구를 삭제하시겠습니까?')) {
      return
    }

    try {
      await friendService.removeFriend(friendId)
      alert('친구를 삭제했습니다.')
      await fetchFriends()
    } catch (error: any) {
      alert(error.response?.data?.detail || '친구 삭제에 실패했습니다.')
    }
  }

  return (
    <div className="space-y-6">
      {/* 탭 메뉴 */}
      <div className="flex gap-1 sm:gap-2 border-b border-gray-200 overflow-x-auto scrollbar-hide -mx-2 sm:mx-0 px-2 sm:px-0">
        <button
          onClick={() => setActiveTab('friends')}
          className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-w-fit ${
            activeTab === 'friends'
              ? 'text-pastel-purple border-b-2 border-pastel-purple'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          친구 목록
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-w-fit ${
            activeTab === 'requests'
              ? 'text-pastel-purple border-b-2 border-pastel-purple'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          친구 요청
          {friendRequests.length > 0 && (
            <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-500 text-white text-xs rounded-full">
              {friendRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-w-fit ${
            activeTab === 'search'
              ? 'text-pastel-purple border-b-2 border-pastel-purple'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          친구 찾기
        </button>
      </div>

      {/* 친구 목록 */}
      {activeTab === 'friends' && (
        <div className="card">
          <h3 className="text-lg sm:text-xl font-bold mb-4">친구 목록</h3>
          {isLoading ? (
            <p className="text-gray-500 text-center py-4 text-sm">로딩 중...</p>
          ) : friends.length === 0 ? (
            <p className="text-gray-500 text-center py-4 text-sm">친구가 없습니다.</p>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {friends.map((friend) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pastel-purple rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-sm sm:text-base">
                      {friend.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm sm:text-base truncate">{friend.username}</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{friend.email}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // 친구 ID 결정: 현재 사용자가 user_id면 friend_id를, friend_id면 user_id를 삭제 대상으로 설정
                      const friendId = friend.user_id === currentUser?.id ? friend.friend_id : friend.user_id
                      handleRemoveFriend(friendId)
                    }}
                    className="btn-secondary text-xs sm:text-sm py-2 px-3 sm:px-4 flex-shrink-0"
                  >
                    삭제
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 친구 요청 */}
      {activeTab === 'requests' && (
        <div className="card">
          <h3 className="text-lg sm:text-xl font-bold mb-4">친구 요청</h3>
          {isLoading ? (
            <p className="text-gray-500 text-center py-4 text-sm">로딩 중...</p>
          ) : friendRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-4 text-sm">받은 친구 요청이 없습니다.</p>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {friendRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pastel-purple rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-sm sm:text-base">
                      {request.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm sm:text-base truncate">{request.username}</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{request.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAcceptRequest(request.id)}
                      className="btn-primary text-xs sm:text-sm py-2 px-3 sm:px-4 flex-1 sm:flex-initial"
                    >
                      수락
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRejectRequest(request.id)}
                      className="btn-secondary text-xs sm:text-sm py-2 px-3 sm:px-4 flex-1 sm:flex-initial"
                    >
                      거절
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 친구 찾기 */}
      {activeTab === 'search' && (
        <div className="card">
          <h3 className="text-lg sm:text-xl font-bold mb-4">친구 찾기</h3>
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="사용자명을 입력하세요"
              className="flex-1 px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-purple"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="btn-primary text-xs sm:text-sm py-2 px-4 whitespace-nowrap"
            >
              검색
            </motion.button>
          </div>
          {isLoading ? (
            <p className="text-gray-500 text-center py-4 text-sm">로딩 중...</p>
          ) : searchResults.length === 0 ? (
            <p className="text-gray-500 text-center py-4 text-sm">
              {searchQuery ? '검색 결과가 없습니다.' : '사용자명을 입력하여 검색하세요.'}
            </p>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {searchResults.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pastel-purple rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-sm sm:text-base">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm sm:text-base truncate">{user.username}</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto">
                    {user.is_friend ? (
                      <span className="text-xs sm:text-sm text-gray-500">이미 친구입니다</span>
                    ) : user.friend_status === 'pending' ? (
                      <span className="text-xs sm:text-sm text-gray-500">요청됨</span>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSendRequest(user.id)}
                        className="btn-primary text-xs sm:text-sm py-2 px-3 sm:px-4 w-full sm:w-auto"
                      >
                        친구 추가
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

