import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { Task, TaskCompletion, Gift, Redemption, Medal, User, Penalty, PenaltyRecord, CrownRecord } from '@/types'
import { getTodayString } from '@/lib/utils'

const INITIAL_MEDALS: Medal[] = [
  { id: '1', name: '皇冠勋章', level: 'crown', starsRequired: 100, icon: '👑', image: '/medal-crown.svg', isUnlocked: false },
]

const INITIAL_GIFTS: Gift[] = [
  { id: '1', name: '贴纸一张', crownsRequired: 0, starsRequired: 10, redeemType: 'stars', description: '可爱的卡通贴纸', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20sticker%20princess%20theme&image_size=square' },
  { id: '2', name: '彩色铅笔', crownsRequired: 0, starsRequired: 25, redeemType: 'stars', description: '漂亮的彩色铅笔套装', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=colorful%20pencils%20set%20cartoon%20style&image_size=square' },
  { id: '3', name: '公主发夹', crownsRequired: 0, starsRequired: 50, redeemType: 'stars', description: '闪闪发光的公主发夹', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=princess%20hair%20clip%20sparkling%20pink&image_size=square' },
  { id: '4', name: '神秘大奖A', crownsRequired: 1, starsRequired: 0, redeemType: 'crowns', description: '皇冠专属神秘大奖', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mystery%20gift%20box%20sparkling%20gold%20princess&image_size=square' },
  { id: '5', name: '洋娃娃', crownsRequired: 2, starsRequired: 0, redeemType: 'crowns', description: '可爱的洋娃娃', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20doll%20princess%20style%20pink&image_size=square' },
  { id: '6', name: '公主裙', crownsRequired: 3, starsRequired: 0, redeemType: 'crowns', description: '漂亮的公主裙', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=princess%20dress%20pink%20beautiful%20cartoon&image_size=square' },
]

const INITIAL_TASKS: Task[] = [
  { id: '1', name: '按时起床', type: 'daily', stars: 1, isContinuous: true, continuousDays: 7, createdAt: new Date().toISOString() },
  { id: '2', name: '自己穿衣服', type: 'daily', stars: 1, isContinuous: false, continuousDays: 0, createdAt: new Date().toISOString() },
  { id: '3', name: '刷牙洗脸', type: 'daily', stars: 1, isContinuous: true, continuousDays: 7, createdAt: new Date().toISOString() },
  { id: '4', name: '吃早餐', type: 'daily', stars: 1, isContinuous: false, continuousDays: 0, createdAt: new Date().toISOString() },
  { id: '5', name: '礼貌用语', type: 'habit', stars: 2, isContinuous: true, continuousDays: 14, createdAt: new Date().toISOString() },
  { id: '6', name: '整理书包', type: 'habit', stars: 2, isContinuous: true, continuousDays: 7, createdAt: new Date().toISOString() },
  { id: '7', name: '认真做作业', type: 'habit', stars: 3, isContinuous: false, continuousDays: 0, createdAt: new Date().toISOString() },
  { id: '8', name: '睡前阅读', type: 'habit', stars: 2, isContinuous: true, continuousDays: 14, createdAt: new Date().toISOString() },
]

const INITIAL_PENALTIES: Penalty[] = [
  { id: '1', name: '迟到', stars: 1, description: '上学迟到扣1颗星星', createdAt: new Date().toISOString() },
  { id: '2', name: '不认真听讲', stars: 2, description: '上课不认真扣2颗星星', createdAt: new Date().toISOString() },
  { id: '3', name: '发脾气', stars: 1, description: '乱发脾气扣1颗星星', createdAt: new Date().toISOString() },
  { id: '4', name: '不整理玩具', stars: 1, description: '不整理玩具扣1颗星星', createdAt: new Date().toISOString() },
]

interface AppStore {
  user: User
  tasks: Task[]
  penalties: Penalty[]
  penaltyRecords: PenaltyRecord[]
  taskCompletions: TaskCompletion[]
  gifts: Gift[]
  redemptions: Redemption[]
  crownRecords: CrownRecord[]
  medals: Medal[]
  maxDailyStars: number
  
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  
  addPenalty: (penalty: Omit<Penalty, 'id' | 'createdAt'>) => void
  updatePenalty: (id: string, updates: Partial<Penalty>) => void
  deletePenalty: (id: string) => void
  applyPenalty: (penaltyId: string) => boolean
  
  completeTask: (taskId: string) => void
  undoCompleteTask: (taskId: string, date?: string) => void
  resetTodayProgress: () => void
  getCompletedTasksByDate: (date: string) => string[]
  getTodayCompletedTasks: () => string[]
  getContinuousDays: (taskId: string) => number
  
  addGift: (gift: Omit<Gift, 'id'>) => void
  updateGift: (id: string, updates: Partial<Gift>) => void
  deleteGift: (id: string) => void
  
  redeemGift: (giftId: string) => boolean
  
  checkMedals: () => void
  
  getStarsToday: () => number
  getStarsThisWeek: () => number
  getStarsByDate: (date: string) => number
  
  switchToParentMode: () => void
  switchToChildMode: () => void
  isParentMode: boolean
  setStars: (current: number, total?: number) => void
  
  addCrown: () => boolean
  refundCrown: (crownCount: number) => void
  
  setMaxDailyStars: (max: number) => void
  canAddStarsToday: (stars: number) => boolean
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      user: {
        id: 'user-1',
        name: '小公主',
        currentStars: 0,
        totalStarsEarned: 0,
        consecutiveDays: 0,
        crowns: 0,
      },
      tasks: INITIAL_TASKS,
      penalties: INITIAL_PENALTIES,
      penaltyRecords: [],
      taskCompletions: [],
      gifts: INITIAL_GIFTS,
      redemptions: [],
      crownRecords: [],
      medals: INITIAL_MEDALS,
      isParentMode: false,
      maxDailyStars: 20,

      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ tasks: [...state.tasks, newTask] }))
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }))
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          taskCompletions: state.taskCompletions.filter((tc) => tc.taskId !== id),
        }))
      },

      addPenalty: (penalty) => {
        const newPenalty: Penalty = {
          ...penalty,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ penalties: [...state.penalties, newPenalty] }))
      },

      updatePenalty: (id, updates) => {
        set((state) => ({
          penalties: state.penalties.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }))
      },

      deletePenalty: (id) => {
        set((state) => ({
          penalties: state.penalties.filter((p) => p.id !== id),
          penaltyRecords: state.penaltyRecords.filter((pr) => pr.penaltyId !== id),
        }))
      },

      applyPenalty: (penaltyId) => {
        const { penalties, user } = get()
        const penalty = penalties.find((p) => p.id === penaltyId)
        if (!penalty) return false

        if (user.currentStars < penalty.stars) return false

        const record: PenaltyRecord = {
          id: uuidv4(),
          penaltyId,
          recordedAt: new Date().toISOString(),
          starsDeducted: penalty.stars,
        }

        set((state) => ({
          penaltyRecords: [...state.penaltyRecords, record],
          user: {
            ...state.user,
            currentStars: Math.max(0, state.user.currentStars - penalty.stars),
          },
        }))

        return true
      },

      completeTask: (taskId) => {
        const { tasks, taskCompletions } = get()
        const task = tasks.find((t) => t.id === taskId)
        if (!task) return

        const today = getTodayString()
        const alreadyCompleted = taskCompletions.some(
          (tc) => tc.taskId === taskId && tc.completedAt === today
        )
        if (alreadyCompleted) return

        let continuousDay: number | undefined
        if (task.isContinuous) {
          const completions = taskCompletions
            .filter((tc) => tc.taskId === taskId)
            .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
          
          const lastCompletion = completions[0]
          if (lastCompletion) {
            const lastDate = new Date(lastCompletion.completedAt)
            const todayDate = new Date(today)
            const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
            
            if (diffDays === 1) {
              continuousDay = (lastCompletion.continuousDay || 0) + 1
            } else if (diffDays === 0) {
              return
            } else {
              continuousDay = 1
            }
          } else {
            continuousDay = 1
          }
        }

        let bonusStars = 0
        if (task.isContinuous && continuousDay) {
          if (continuousDay % task.continuousDays === 0) {
            bonusStars = 10
          }
        }
        const totalStars = task.stars + bonusStars

        const completion: TaskCompletion = {
          id: uuidv4(),
          taskId,
          completedAt: today,
          starsEarned: task.stars,
          continuousDay,
          bonusStars,
        }

        set((state) => ({
          taskCompletions: [...state.taskCompletions, completion],
          user: {
            ...state.user,
            currentStars: state.user.currentStars + totalStars,
            totalStarsEarned: state.user.totalStarsEarned + totalStars,
            consecutiveDays: state.user.consecutiveDays + 1,
          },
        }))

        get().checkMedals()
      },

      undoCompleteTask: (taskId, date) => {
        const { tasks, taskCompletions } = get()
        const task = tasks.find((t) => t.id === taskId)
        if (!task) return

        const targetDate = date || getTodayString()
        const completion = taskCompletions.find(
          (tc) => tc.taskId === taskId && tc.completedAt === targetDate
        )
        if (!completion) return

        const totalStars = completion.starsEarned + (completion.bonusStars || 0)

        set((state) => ({
          taskCompletions: state.taskCompletions.filter((tc) => tc.id !== completion.id),
          user: {
            ...state.user,
            currentStars: Math.max(0, state.user.currentStars - totalStars),
            totalStarsEarned: Math.max(0, state.user.totalStarsEarned - totalStars),
            consecutiveDays: Math.max(0, state.user.consecutiveDays - 1),
          },
        }))

        get().checkMedals()
      },

      resetTodayProgress: () => {
        const today = getTodayString()
        const { taskCompletions } = get()
        
        const todayCompletions = taskCompletions.filter((tc) => tc.completedAt === today)
        const totalStarsEarnedToday = todayCompletions.reduce(
          (sum, tc) => sum + tc.starsEarned + (tc.bonusStars || 0),
          0
        )

        set((state) => ({
          taskCompletions: state.taskCompletions.filter((tc) => tc.completedAt !== today),
          user: {
            ...state.user,
            currentStars: Math.max(0, state.user.currentStars - totalStarsEarnedToday),
            totalStarsEarned: Math.max(0, state.user.totalStarsEarned - totalStarsEarnedToday),
          },
        }))

        get().checkMedals()
      },

      getCompletedTasksByDate: (date) => {
        const { taskCompletions } = get()
        return taskCompletions
          .filter((tc) => tc.completedAt === date)
          .map((tc) => tc.taskId)
      },

      getTodayCompletedTasks: () => {
        const { taskCompletions } = get()
        const today = getTodayString()
        return taskCompletions
          .filter((tc) => tc.completedAt === today)
          .map((tc) => tc.taskId)
      },

      getContinuousDays: (taskId) => {
        const { taskCompletions } = get()
        const completions = taskCompletions
          .filter((tc) => tc.taskId === taskId)
          .map((tc) => tc.completedAt)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        
        if (completions.length === 0) return 0
        
        const today = getTodayString()
        if (completions[0] !== today) return 0
        
        let consecutiveDays = 1
        let currentDate = new Date(today)
        
        for (let i = 1; i < completions.length; i++) {
          const previousDate = new Date(completions[i])
          const expectedDate = new Date(currentDate)
          expectedDate.setDate(expectedDate.getDate() - 1)
          
          if (
            previousDate.getFullYear() === expectedDate.getFullYear() &&
            previousDate.getMonth() === expectedDate.getMonth() &&
            previousDate.getDate() === expectedDate.getDate()
          ) {
            consecutiveDays++
            currentDate = previousDate
          } else {
            break
          }
        }
        
        return consecutiveDays
      },

      addGift: (gift) => {
        const newGift: Gift = {
          ...gift,
          id: uuidv4(),
        }
        set((state) => ({ gifts: [...state.gifts, newGift] }))
      },

      updateGift: (id, updates) => {
        set((state) => ({
          gifts: state.gifts.map((gift) =>
            gift.id === id ? { ...gift, ...updates } : gift
          ),
        }))
      },

      deleteGift: (id) => {
        set((state) => ({
          gifts: state.gifts.filter((gift) => gift.id !== id),
          redemptions: state.redemptions.filter((r) => r.giftId !== id),
        }))
      },

      redeemGift: (giftId) => {
        const { gifts, user } = get()
        const gift = gifts.find((g) => g.id === giftId)
        if (!gift) return false

        if (gift.redeemType === 'stars') {
          if (user.currentStars < gift.starsRequired) return false

          const redemption: Redemption = {
            id: uuidv4(),
            giftId,
            redeemedAt: new Date().toISOString(),
            crownsUsed: 0,
          }

          set((state) => ({
            redemptions: [...state.redemptions, redemption],
            user: {
              ...state.user,
              currentStars: state.user.currentStars - gift.starsRequired,
            },
          }))

          return true
        } else {
          if (user.crowns < gift.crownsRequired) return false

          const redemption: Redemption = {
            id: uuidv4(),
            giftId,
            redeemedAt: new Date().toISOString(),
            crownsUsed: gift.crownsRequired,
          }

          set((state) => ({
            redemptions: [...state.redemptions, redemption],
            user: {
              ...state.user,
              crowns: state.user.crowns - gift.crownsRequired,
            },
          }))

          return true
        }
      },

      checkMedals: () => {
        const { user, medals } = get()
        const updatedMedals = medals.map((medal) => {
          if (medal.isUnlocked) return medal
          if (user.totalStarsEarned >= medal.starsRequired) {
            return {
              ...medal,
              isUnlocked: true,
              unlockedAt: new Date().toISOString(),
            }
          }
          return medal
        })
        set({ medals: updatedMedals })
        get().addCrown()
      },

      addCrown: () => {
        const { user, crownRecords } = get()
        const crownsEarned = Math.floor(user.totalStarsEarned / 100)
        const existingCrowns = crownRecords
          .filter((cr) => cr.type === 'earn')
          .reduce((sum, cr) => sum + cr.amount, 0)
        
        const newCrowns = crownsEarned - existingCrowns - user.crowns
        
        if (newCrowns > 0) {
          const crownRecord: CrownRecord = {
            id: uuidv4(),
            type: 'earn',
            amount: newCrowns,
            recordedAt: new Date().toISOString(),
            description: `累计积分获得皇冠 x${newCrowns}`,
          }
          
          set((state) => ({
            crownRecords: [...state.crownRecords, crownRecord],
            user: {
              ...state.user,
              crowns: state.user.crowns + newCrowns,
            },
          }))
          return true
        }
        return false
      },

      refundCrown: (crownCount) => {
        const { user } = get()
        if (user.crowns < crownCount) return

        const starsRefunded = crownCount * 100
        
        const crownRecord: CrownRecord = {
          id: uuidv4(),
          type: 'refund',
          amount: crownCount,
          recordedAt: new Date().toISOString(),
          description: `回收皇冠 x${crownCount}，返还积分 ${starsRefunded}`,
        }

        set((state) => ({
          crownRecords: [...state.crownRecords, crownRecord],
          user: {
            ...state.user,
            crowns: state.user.crowns - crownCount,
            currentStars: state.user.currentStars + starsRefunded,
          },
        }))
      },

      getStarsToday: () => {
        const { taskCompletions, penaltyRecords } = get()
        const today = getTodayString()
        const earned = taskCompletions
          .filter((tc) => tc.completedAt === today)
          .reduce((sum, tc) => sum + tc.starsEarned, 0)
        const deducted = penaltyRecords
          .filter((pr) => pr.recordedAt.startsWith(today))
          .reduce((sum, pr) => sum + pr.starsDeducted, 0)
        return earned - deducted
      },

      getStarsThisWeek: () => {
        const { taskCompletions, penaltyRecords } = get()
        const today = new Date()
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1))
        weekStart.setHours(0, 0, 0, 0)

        const earned = taskCompletions
          .filter((tc) => new Date(tc.completedAt) >= weekStart)
          .reduce((sum, tc) => sum + tc.starsEarned, 0)
        const deducted = penaltyRecords
          .filter((pr) => new Date(pr.recordedAt) >= weekStart)
          .reduce((sum, pr) => sum + pr.starsDeducted, 0)
        return earned - deducted
      },

      getStarsByDate: (date) => {
        const { taskCompletions, penaltyRecords } = get()
        const earned = taskCompletions
          .filter((tc) => tc.completedAt === date)
          .reduce((sum, tc) => sum + tc.starsEarned, 0)
        const deducted = penaltyRecords
          .filter((pr) => pr.recordedAt.startsWith(date))
          .reduce((sum, pr) => sum + pr.starsDeducted, 0)
        return earned - deducted
      },

      switchToParentMode: () => set({ isParentMode: true }),
      switchToChildMode: () => set({ isParentMode: false }),
      setStars: (current: number, total?: number) => set((state) => {
        const newTotalStars = total !== undefined ? total : state.user.totalStarsEarned
        const crownsEarned = Math.floor(newTotalStars / 100)
        const currentCrowns = state.user.crowns
        
        let newCrowns = currentCrowns
        if (crownsEarned < currentCrowns) {
          newCrowns = crownsEarned
        }
        
        return {
          user: {
            ...state.user,
            currentStars: current,
            totalStarsEarned: newTotalStars,
            crowns: newCrowns
          }
        }
      }),
      
      setMaxDailyStars: (max: number) => set({ maxDailyStars: Math.max(1, Math.min(100, max)) }),
      
      canAddStarsToday: (stars: number) => {
        const { maxDailyStars, taskCompletions } = get()
        const today = getTodayString()
        const earnedToday = taskCompletions
          .filter((tc) => tc.completedAt === today)
          .reduce((sum, tc) => sum + tc.starsEarned, 0)
        return earnedToday + stars <= maxDailyStars
      },
    }),
    {
      name: 'star-adventure-storage-v3',
    }
  )
)

export const useTaskStore = () => useStore((state) => ({
  tasks: state.tasks,
  addTask: state.addTask,
  updateTask: state.updateTask,
  deleteTask: state.deleteTask,
  completeTask: state.completeTask,
  undoCompleteTask: state.undoCompleteTask,
  resetTodayProgress: state.resetTodayProgress,
  getTodayCompletedTasks: state.getTodayCompletedTasks,
  getCompletedTasksByDate: state.getCompletedTasksByDate,
  getContinuousDays: state.getContinuousDays,
}))

export const usePenaltyStore = () => useStore((state) => ({
  penalties: state.penalties,
  penaltyRecords: state.penaltyRecords,
  addPenalty: state.addPenalty,
  updatePenalty: state.updatePenalty,
  deletePenalty: state.deletePenalty,
  applyPenalty: state.applyPenalty,
}))

export const useStarStore = () => useStore((state) => ({
  user: state.user,
  taskCompletions: state.taskCompletions,
  penaltyRecords: state.penaltyRecords,
  crownRecords: state.crownRecords,
  maxDailyStars: state.maxDailyStars,
  getStarsToday: state.getStarsToday,
  getStarsThisWeek: state.getStarsThisWeek,
  getStarsByDate: state.getStarsByDate,
  setStars: state.setStars,
  addCrown: state.addCrown,
  refundCrown: state.refundCrown,
  setMaxDailyStars: state.setMaxDailyStars,
  canAddStarsToday: state.canAddStarsToday,
}))

export const useGiftStore = () => useStore((state) => ({
  gifts: state.gifts,
  redemptions: state.redemptions,
  addGift: state.addGift,
  updateGift: state.updateGift,
  deleteGift: state.deleteGift,
  redeemGift: state.redeemGift,
}))

export const useMedalStore = () => useStore((state) => ({
  medals: state.medals,
  checkMedals: state.checkMedals,
}))

export const useModeStore = () => useStore((state) => ({
  isParentMode: state.isParentMode,
  switchToParentMode: state.switchToParentMode,
  switchToChildMode: state.switchToChildMode,
}))
