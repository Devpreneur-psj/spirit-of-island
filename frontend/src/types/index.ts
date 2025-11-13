// 프론트엔드 타입 정의
export enum Element {
  FIRE = 'fire',
  WATER = 'water',
  WIND = 'wind',
  EARTH = 'earth',
  PLANT = 'plant',
  ELECTRIC = 'electric',
  LIGHT = 'light',
  DARK = 'dark',
}

export enum Personality {
  PLAYFUL = 'playful',
  GENTLE = 'gentle',
  AGGRESSIVE = 'aggressive',
  INTROVERTED = 'introverted',
  CHEERFUL = 'cheerful',
  CALM = 'calm',
  CURIOUS = 'curious',
  LAZY = 'lazy',
}

export enum GrowthStage {
  EGG = 'egg',
  INFANT = 'infant',
  ADOLESCENT = 'adolescent',
  ADULT = 'adult',
  TRANSCENDENT = 'transcendent',
  ELDER = 'elder',
}

export interface Stats {
  health: number
  agility: number
  intelligence: number
  friendliness: number
  resilience: number
  luck: number
}

export interface Status {
  hunger: number
  happiness: number
  energy: number
  health: number
  cleanliness: number
}

export interface Spiritling {
  id: string
  name: string
  element: string
  personality: string
  growth_stage: string
  level: number
  experience: number
  health_stat: number
  agility_stat: number
  intelligence_stat: number
  friendliness_stat: number
  resilience_stat: number
  luck_stat: number
  hunger: number
  happiness: number
  energy: number
  health_status: number
  cleanliness: number
  current_action: string
  action_data: Record<string, any>
  user_id: string
  created_at: string
  updated_at?: string
}

// Helper 타입 (기존 형식과 호환)
export interface SpiritlingDisplay {
  id: string
  name: string
  element: Element
  personality: Personality
  growthStage: GrowthStage
  stats: Stats
  status: Status
  level: number
  experience: number
  currentAction: string
  actionData: Record<string, any>
  userId: string
  createdAt: string
  updatedAt?: string
}

// 변환 함수
export function toDisplayFormat(spiritling: Spiritling): SpiritlingDisplay {
  return {
    id: spiritling.id,
    name: spiritling.name,
    element: spiritling.element as Element,
    personality: spiritling.personality as Personality,
    growthStage: spiritling.growth_stage as GrowthStage,
    stats: {
      health: spiritling.health_stat,
      agility: spiritling.agility_stat,
      intelligence: spiritling.intelligence_stat,
      friendliness: spiritling.friendliness_stat,
      resilience: spiritling.resilience_stat,
      luck: spiritling.luck_stat,
    },
    status: {
      hunger: spiritling.hunger,
      happiness: spiritling.happiness,
      energy: spiritling.energy,
      health: spiritling.health_status,
      cleanliness: spiritling.cleanliness,
    },
    level: spiritling.level,
    experience: spiritling.experience,
    currentAction: spiritling.current_action,
    actionData: spiritling.action_data,
    userId: spiritling.user_id,
    createdAt: spiritling.created_at,
    updatedAt: spiritling.updated_at,
  }
}

export interface User {
  id: string
  username: string
  email: string
  coins: number
  createdAt: string
}

export interface Item {
  id: string
  name: string
  type: string
  description?: string
  effect: {
    stat?: keyof Stats
    status?: keyof Status
    value: number
  }
  price: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface Competition {
  id: string
  type: string
  name: string
  description?: string
  start_date: string
  end_date: string
  rewards: {
    first?: Array<{ id: string; quantity?: number }>
    second?: Array<{ id: string; quantity?: number }>
    third?: Array<{ id: string; quantity?: number }>
  }
  status: string
}

export interface ActionLog {
  id: string
  spiritling_id: string
  action_type: string
  message: string
  created_at: string
}

export interface Friend {
  id: string
  user_id: string
  friend_id: string
  username: string
  email: string
  status: string
  created_at: string
}

export interface FriendRequest {
  id: string
  user_id: string
  friend_id: string
  username: string
  email: string
  status: string
  created_at: string
}

export interface SearchedUser {
  id: string
  username: string
  email: string
  is_friend: boolean
  friend_status: string | null
}

