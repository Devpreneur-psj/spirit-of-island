// 공통 타입 정의

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
  health: number;      // 체력
  agility: number;     // 민첩
  intelligence: number; // 지능
  friendliness: number; // 친근함
  resilience: number;   // 근성
  luck: number;         // 운
}

export interface Status {
  hunger: number;      // 배고픔 (0-100)
  happiness: number;   // 행복도 (0-100)
  energy: number;      // 에너지 (0-100)
  health: number;      // 건강 (0-100)
  cleanliness: number; // 청결도 (0-100)
}

export interface Spiritling {
  id: string;
  name: string;
  element: Element;
  personality: Personality;
  growthStage: GrowthStage;
  stats: Stats;
  status: Status;
  level: number;
  experience: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export enum ItemType {
  FOOD = 'food',
  VITAMIN = 'vitamin',
  TOY = 'toy',
  MEDICINE = 'medicine',
  ACCESSORY = 'accessory',
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  effect: {
    stat?: keyof Stats;
    status?: keyof Status;
    value: number;
  };
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export enum CompetitionType {
  RACE = 'race',
  PUZZLE = 'puzzle',
  BATTLE = 'battle',
  FASHION = 'fashion',
}

export interface Competition {
  id: string;
  type: CompetitionType;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  rewards: {
    first: Item[];
    second: Item[];
    third: Item[];
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  coins: number;
  spiritlings: Spiritling[];
  items: Item[];
}

