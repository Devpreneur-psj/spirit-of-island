import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface Building {
  id: string
  name: string
  type: string
  icon: string
  description: string
  level?: number
  position: { x: number; y: number }
}

interface BuildingInteractionPanelProps {
  building: Building
  onClose: () => void
}

const BUILDING_FUNCTIONS: Record<string, {
  title: string
  description: string
  icon: string
  actions: Array<{ 
    name: string
    icon: string
    description?: string
    onClick: () => void
  }>
}> = {
  'house': {
    title: '정령의 집',
    description: '정령들이 휴식하고 생활하는 곳',
    icon: '🏠',
    actions: [
      { 
        name: '정령 목록 보기', 
        icon: '👥',
        description: '모든 정령의 상태를 확인합니다',
        onClick: () => {}
      },
      { 
        name: '휴식 지정', 
        icon: '😴',
        description: '모든 정령에게 휴식 작업을 지정합니다',
        onClick: () => {}
      },
    ],
  },
  'training-ground': {
    title: '수련장',
    description: '정령들의 능력치를 향상시키는 곳',
    icon: '⚔️',
    actions: [
      { 
        name: '훈련 시작', 
        icon: '💪',
        description: '정령들에게 훈련 작업을 지정합니다',
        onClick: () => {}
      },
      { 
        name: '훈련 설정', 
        icon: '⚙️',
        description: '훈련 옵션을 설정합니다',
        onClick: () => {}
      },
    ],
  },
  'shop': {
    title: '상점',
    description: '아이템을 구매하고 판매하는 곳',
    icon: '🛒',
    actions: [
      { 
        name: '아이템 상점 열기', 
        icon: '💰',
        description: '다양한 아이템을 구매할 수 있습니다',
        onClick: () => {}
      },
      { 
        name: '보관함 열기', 
        icon: '📦',
        description: '보유한 아이템을 확인합니다',
        onClick: () => {}
      },
    ],
  },
}

interface BuildingInteractionPanelProps {
  building: Building
  onClose: () => void
  onNavigate?: (locationId: string) => void
}

export default function BuildingInteractionPanel({ building, onClose, onNavigate }: BuildingInteractionPanelProps) {
  const buildingFunction = BUILDING_FUNCTIONS[building.type] || BUILDING_FUNCTIONS['house']
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  const handleAction = (action: { name: string; icon: string; onClick: () => void }) => {
    setSelectedAction(action.name)
    
    // 건물 타입에 따른 실제 동작
    if (building.type === 'shop') {
      if (action.name === '아이템 상점 열기') {
        onClose()
        if (onNavigate) {
          setTimeout(() => onNavigate('item-shop'), 300)
        }
      } else if (action.name === '보관함 열기') {
        onClose()
        if (onNavigate) {
          setTimeout(() => onNavigate('inventory'), 300)
        }
      }
    } else {
      action.onClick()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{buildingFunction.icon}</div>
            <div>
              <h2 className="text-2xl font-bold">{buildingFunction.title}</h2>
              <p className="text-sm text-gray-600">{buildingFunction.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* 레벨 표시 */}
        {building.level && (
          <div className="mb-4 p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">레벨</span>
              <span className="text-lg font-bold text-purple-600">{building.level}</span>
            </div>
          </div>
        )}

        {/* 기능 목록 */}
        <div className="space-y-2 mb-4">
          {buildingFunction.actions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction(action)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedAction === action.name
                  ? 'border-pastel-purple bg-pastel-purple/10 shadow-md'
                  : 'border-gray-200 hover:border-pastel-purple/50 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{action.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{action.name}</div>
                  {action.description && (
                    <div className="text-xs text-gray-500 mt-1">{action.description}</div>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* 정보 */}
        <div className="pt-4 border-t border-gray-200 text-sm text-gray-600">
          💡 건물을 클릭하여 다양한 기능을 사용할 수 있습니다.
        </div>
      </motion.div>
    </motion.div>
  )
}

