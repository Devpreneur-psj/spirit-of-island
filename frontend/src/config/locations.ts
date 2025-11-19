// 확장 가능한 장소 설정 파일
export interface Location {
  id: string
  name: string
  description: string
  icon: string
  emoji: string
  position: { x: number; y: number } // 퍼센트 기준 위치
  color: string
  tab?: string // 연결된 탭 ID
  category: 'home' | 'shop' | 'social' | 'activity' | 'special'
  unlocked?: boolean // 잠금 해제 여부
  level?: number // 잠금 해제 레벨
}

export const locations: Location[] = [
  // 원소 홈 - 정령이 보이는 곳
  {
    id: 'element-home',
    name: '원소 홈',
    description: '마정령들이 휴식하는 곳',
    icon: '🏠',
    emoji: '🏠',
    position: { x: 20, y: 30 },
    color: 'from-purple-400 to-pink-400',
    tab: 'spiritling',
    category: 'home',
    unlocked: true,
  },
  // 상점
  {
    id: 'item-shop',
    name: '아이템 상점',
    description: '다양한 아이템을 구매하세요',
    icon: '🛒',
    emoji: '🛒',
    position: { x: 50, y: 25 },
    color: 'from-orange-400 to-yellow-400',
    tab: 'shop',
    category: 'shop',
    unlocked: true,
  },
  // 인벤토리
  {
    id: 'inventory',
    name: '보관함',
    description: '보유한 아이템을 확인하세요',
    icon: '📦',
    emoji: '📦',
    position: { x: 50, y: 50 },
    color: 'from-blue-400 to-cyan-400',
    tab: 'inventory',
    category: 'shop',
    unlocked: true,
  },
  // 대회장
  {
    id: 'competition-hall',
    name: '대회장',
    description: '마정령 대회에 참가하세요',
    icon: '🏆',
    emoji: '🏆',
    position: { x: 75, y: 30 },
    color: 'from-yellow-400 to-orange-400',
    tab: 'competition',
    category: 'activity',
    unlocked: true,
  },
  // 친구 마을
  {
    id: 'friend-village',
    name: '친구 마을',
    description: '친구들과 소통하세요',
    icon: '👥',
    emoji: '👥',
    position: { x: 30, y: 60 },
    color: 'from-green-400 to-emerald-400',
    tab: 'friends',
    category: 'social',
    unlocked: true,
  },
  // 마을 광장
  {
    id: 'village-square',
    name: '마을 광장',
    description: '다른 플레이어들을 만나보세요',
    icon: '🏛️',
    emoji: '🏛️',
    position: { x: 60, y: 60 },
    color: 'from-indigo-400 to-purple-400',
    tab: 'village',
    category: 'social',
    unlocked: true,
  },
  // 랭킹 전당
  {
    id: 'ranking-hall',
    name: '명예의 전당',
    description: '최고의 마정령들을 확인하세요',
    icon: '⭐',
    emoji: '⭐',
    position: { x: 80, y: 50 },
    color: 'from-amber-400 to-yellow-400',
    tab: 'ranking',
    category: 'activity',
    unlocked: true,
  },
  // 업적 섬
  {
    id: 'achievement-island',
    name: '업적 섬',
    description: '달성한 업적을 확인하세요',
    icon: '🎖️',
    emoji: '🎖️',
    position: { x: 15, y: 50 },
    color: 'from-rose-400 to-pink-400',
    tab: 'achievements',
    category: 'activity',
    unlocked: true,
  },
  // 이벤트 섬
  {
    id: 'event-island',
    name: '이벤트 섬',
    description: '진행 중인 이벤트를 확인하세요',
    icon: '🎉',
    emoji: '🎉',
    position: { x: 40, y: 15 },
    color: 'from-violet-400 to-purple-400',
    tab: 'events',
    category: 'special',
    unlocked: true,
  },
  // 미래 확장을 위한 예시 장소들 (잠금 상태)
  {
    id: 'training-ground',
    name: '훈련장',
    description: '마정령을 훈련시키세요 (준비 중)',
    icon: '⚔️',
    emoji: '⚔️',
    position: { x: 25, y: 75 },
    color: 'from-gray-400 to-gray-500',
    category: 'activity',
    unlocked: false,
    level: 10,
  },
  {
    id: 'adventure-gate',
    name: '모험의 문',
    description: '새로운 모험을 떠나세요 (준비 중)',
    icon: '🚪',
    emoji: '🚪',
    position: { x: 70, y: 75 },
    color: 'from-gray-400 to-gray-500',
    category: 'special',
    unlocked: false,
    level: 15,
  },
]

export const getLocationById = (id: string): Location | undefined => {
  return locations.find(loc => loc.id === id)
}

export const getUnlockedLocations = (): Location[] => {
  return locations.filter(loc => loc.unlocked !== false)
}

