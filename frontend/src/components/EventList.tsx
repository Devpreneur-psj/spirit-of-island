import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { eventService, Event, EventParticipation } from '../services/eventService'

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([])
  const [myEvents, setMyEvents] = useState<EventParticipation[]>([])
  const [statusFilter, setStatusFilter] = useState<string | undefined>('active')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchEvents()
    fetchMyEvents()
  }, [statusFilter])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      const data = await eventService.getEvents(statusFilter)
      setEvents(data)
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMyEvents = async () => {
    try {
      const data = await eventService.getMyEvents()
      setMyEvents(data)
    } catch (error) {
      console.error('Failed to fetch my events:', error)
    }
  }

  const handleParticipate = async (eventId: string) => {
    try {
      await eventService.participateEvent(eventId)
      alert('이벤트에 참가했습니다!')
      fetchMyEvents()
    } catch (error: any) {
      alert(error.response?.data?.detail || '이벤트 참가에 실패했습니다.')
    }
  }

  const handleClaimReward = async (eventId: string, rewardKey: string) => {
    try {
      await eventService.claimEventReward(eventId, rewardKey)
      alert('보상을 받았습니다!')
      fetchMyEvents()
    } catch (error: any) {
      alert(error.response?.data?.detail || '보상 받기에 실패했습니다.')
    }
  }

  const getMyParticipation = (eventId: string) => {
    return myEvents.find(pe => pe.event_id === eventId)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      upcoming: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      ended: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg sm:text-xl font-bold mb-4">이벤트</h3>
        
        {/* 상태 필터 */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStatusFilter(undefined)}
              className={`px-3 py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                !statusFilter
                  ? 'bg-pastel-purple text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStatusFilter('upcoming')}
              className={`px-3 py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                statusFilter === 'upcoming'
                  ? 'bg-pastel-purple text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              예정
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                statusFilter === 'active'
                  ? 'bg-pastel-purple text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              진행중
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStatusFilter('ended')}
              className={`px-3 py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                statusFilter === 'ended'
                  ? 'bg-pastel-purple text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              종료
            </motion.button>
          </div>
        </div>

        {/* 이벤트 목록 */}
        {isLoading ? (
          <p className="text-gray-500 text-center py-4 text-sm">로딩 중...</p>
        ) : events.length === 0 ? (
          <p className="text-gray-500 text-center py-4 text-sm">이벤트가 없습니다.</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {events.map((event, index) => {
              const participation = getMyParticipation(event.id)
              const isParticipating = !!participation
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg border-2 border-gray-200 bg-white"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-sm sm:text-base truncate">{event.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(event.status)}`}>
                          {event.status === 'upcoming' && '예정'}
                          {event.status === 'active' && '진행중'}
                          {event.status === 'ended' && '종료'}
                        </span>
                        {event.multiplier > 1 && (
                          <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full font-medium">
                            {event.multiplier}x 보너스
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="text-xs sm:text-sm text-gray-500 mb-2">
                        기간: {formatDate(event.start_date)} ~ {formatDate(event.end_date)}
                      </div>
                      {isParticipating && (
                        <div className="text-xs sm:text-sm text-green-600 font-medium mb-2">
                          참가 중
                        </div>
                      )}
                      {participation && (
                        <div className="text-xs sm:text-sm text-gray-600 mb-2">
                          진행 상황: {JSON.stringify(participation.progress)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* 보상 목록 */}
                  {event.rewards && Object.keys(event.rewards).length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs sm:text-sm font-medium mb-2">보상:</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(event.rewards).map(([key, reward]: [string, any]) => {
                          const isClaimed = participation?.rewards_claimed?.includes(key)
                          return (
                            <div
                              key={key}
                              className={`px-2 py-1 rounded text-xs ${
                                isClaimed
                                  ? 'bg-gray-200 text-gray-600 line-through'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {reward.coins > 0 && `💰 ${reward.coins} 코인`}
                              {isClaimed && ' (받음)'}
                              {!isClaimed && participation && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleClaimReward(event.id, key)}
                                  className="ml-2 text-blue-600 hover:text-blue-800 underline"
                                >
                                  받기
                                </motion.button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* 참가 버튼 */}
                  {event.status === 'active' && !isParticipating && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleParticipate(event.id)}
                      className="btn-primary text-xs sm:text-sm py-2 px-3 sm:px-4 w-full"
                    >
                      참가하기
                    </motion.button>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

