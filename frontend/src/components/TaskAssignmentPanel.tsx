import { useState } from 'react'
import { motion } from 'framer-motion'
import { Spiritling } from '../types'
import { useSpiritlingStore } from '../stores/spiritlingStore'

interface TaskAssignmentPanelProps {
  spiritling: Spiritling
  onTaskAssigned?: () => void
}

const TASKS = [
  { id: 'idle', name: '자유 행동', icon: '😊', description: '정령이 자유롭게 행동합니다' },
  { id: 'training', name: '훈련', icon: '💪', description: '능력치가 증가하지만 피로도가 올라갑니다' },
  { id: 'resting', name: '휴식', icon: '😴', description: '피로도와 체력이 회복됩니다' },
  { id: 'farming', name: '농장일', icon: '🌾', description: '골드를 획득하지만 피로도가 올라갑니다' },
  { id: 'exploring', name: '탐험', icon: '🔍', description: '경험치를 획득합니다' },
  { id: 'playing', name: '놀기', icon: '🎮', description: '행복도가 증가합니다' },
]

export default function TaskAssignmentPanel({ spiritling, onTaskAssigned }: TaskAssignmentPanelProps) {
  const { assignTask, fetchSpiritlings } = useSpiritlingStore()
  const [selectedTask, setSelectedTask] = useState<string>(spiritling.current_action || 'idle')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAssignTask = async (taskId: string) => {
    if (selectedTask === taskId) return // 이미 선택된 작업이면 무시
    
    setIsLoading(true)
    setError('')
    
    try {
      await assignTask(spiritling.id, taskId)
      setSelectedTask(taskId)
      await fetchSpiritlings() // 정령 목록 새로고침
      
      if (onTaskAssigned) {
        onTaskAssigned()
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || '작업 지정에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-bold mb-2">작업 지정</h4>
        <p className="text-sm text-gray-600 mb-4">
          정령에게 할 일을 지정하면 자동으로 수행합니다.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {TASKS.map((task) => (
          <motion.button
            key={task.id}
            onClick={() => handleAssignTask(task.id)}
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedTask === task.id
                ? 'border-pastel-purple bg-pastel-purple/10 shadow-md'
                : 'border-gray-200 hover:border-pastel-purple/50 bg-white'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="text-3xl mb-2">{task.icon}</div>
            <div className="text-sm font-bold">{task.name}</div>
            <div className="text-xs text-gray-500 mt-1">{task.description}</div>
            {selectedTask === task.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-6 h-6 bg-pastel-purple rounded-full flex items-center justify-center text-white text-xs"
              >
                ✓
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {selectedTask && (
        <div className="p-3 bg-blue-50 rounded-lg text-sm">
          <div className="font-bold text-blue-800 mb-1">현재 작업</div>
          <div className="text-blue-600">
            {TASKS.find(t => t.id === selectedTask)?.name || selectedTask}
          </div>
        </div>
      )}
    </div>
  )
}

