import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ActionLog as ActionLogType } from '../types'
import { actionLogService } from '../services/actionLogService'

interface ActionLogProps {
  spiritlingId: string
}

export default function ActionLog({ spiritlingId }: ActionLogProps) {
  const [logs, setLogs] = useState<ActionLogType[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchLogs()
    // 5초마다 새로고침
    const interval = setInterval(fetchLogs, 5000)
    return () => clearInterval(interval)
  }, [spiritlingId])

  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      const actionLogs = await actionLogService.getSpiritlingActionLogs(spiritlingId, 10)
      setLogs(actionLogs)
    } catch (error) {
      console.error('Failed to fetch action logs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getActionIcon = (actionType: string) => {
    const icons: Record<string, string> = {
      feed: '🍽️',
      play: '🎮',
      heal: '💊',
      clean: '🛁',
      train: '⚡',
      auto_eat: '🌾',
      auto_play: '🎯',
      auto_activity: '🏃',
      level_up: '✨',
      create: '🎉',
      use_item: '📦',
    }
    return icons[actionType] || '💬'
  }

  const getActionColor = (actionType: string) => {
    const colors: Record<string, string> = {
      feed: 'bg-pink-100 border-pink-400',
      play: 'bg-blue-100 border-blue-400',
      heal: 'bg-green-100 border-green-400',
      clean: 'bg-cyan-100 border-cyan-400',
      train: 'bg-purple-100 border-purple-400',
      auto_eat: 'bg-yellow-100 border-yellow-400',
      auto_play: 'bg-indigo-100 border-indigo-400',
      auto_activity: 'bg-orange-100 border-orange-400',
      level_up: 'bg-yellow-200 border-yellow-500 shadow-lg',
      create: 'bg-gradient-to-r from-pink-100 to-purple-100 border-pink-400',
      use_item: 'bg-blue-50 border-blue-300',
    }
    return colors[actionType] || 'bg-gray-100 border-gray-300'
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (seconds < 60) {
      return '방금 전'
    } else if (minutes < 60) {
      return `${minutes}분 전`
    } else if (hours < 24) {
      return `${hours}시간 전`
    } else {
      return date.toLocaleDateString('ko-KR')
    }
  }

    return (
      <div className="card">
        <h3 className="text-lg sm:text-xl font-bold mb-4">행동 로그</h3>
        <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
          <AnimatePresence>
            {logs.length === 0 ? (
              <p className="text-gray-500 text-center py-4 text-sm">행동 로그가 없습니다.</p>
            ) : (
              logs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-2 sm:p-3 rounded-lg border-2 ${getActionColor(log.action_type)} relative overflow-hidden`}
                >
                  {/* 배경 애니메이션 효과 */}
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  />
                  
                  <div className="flex items-start gap-2 relative z-10">
                    <motion.span 
                      className="text-lg sm:text-2xl flex-shrink-0"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    >
                      {getActionIcon(log.action_type)}
                    </motion.span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-800 break-words">{log.message}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <span>🕐</span>
                        <span>{formatTime(log.created_at)}</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

