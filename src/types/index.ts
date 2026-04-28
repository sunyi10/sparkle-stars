export type TaskType = 'daily' | 'habit'

export interface Task {
  id: string
  name: string
  type: TaskType
  stars: number
  isContinuous: boolean
  continuousDays: number
  createdAt: string
}

export interface Penalty {
  id: string
  name: string
  stars: number
  description: string
  createdAt: string
}

export interface PenaltyRecord {
  id: string
  penaltyId: string
  recordedAt: string
  starsDeducted: number
}

export interface TaskCompletion {
  id: string
  taskId: string
  completedAt: string
  starsEarned: number
  continuousDay?: number
  bonusStars?: number
}

export type GiftRedeemType = 'stars' | 'crowns'

export interface Gift {
  id: string
  name: string
  crownsRequired: number
  starsRequired: number
  redeemType: GiftRedeemType
  description: string
  image?: string
}

export interface Redemption {
  id: string
  giftId: string
  redeemedAt: string
  crownsUsed: number
}

export interface CrownRecord {
  id: string
  type: 'earn' | 'exchange' | 'redeem' | 'refund'
  amount: number
  relatedId?: string
  recordedAt: string
  description: string
}

export interface Medal {
  id: string
  name: string
  level: string
  starsRequired: number
  icon: string
  image?: string
  isUnlocked: boolean
  unlockedAt?: string
}

export interface User {
  id: string
  name: string
  avatar?: string
  currentStars: number
  totalStarsEarned: number
  consecutiveDays: number
  crowns: number
}

export interface AppState {
  user: User
  tasks: Task[]
  penalties: Penalty[]
  penaltyRecords: PenaltyRecord[]
  taskCompletions: TaskCompletion[]
  gifts: Gift[]
  redemptions: Redemption[]
  crownRecords: CrownRecord[]
  medals: Medal[]
}
