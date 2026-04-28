import { useState } from 'react'
import { Flame, CheckCircle, Edit2, Trash2, Zap, Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'
import { useTaskStore, useModeStore, useStarStore } from '@/store'

interface TaskCardProps {
  task: Task
  isCompleted: boolean
  continuousDays: number
  onEdit: () => void
}

export function TaskCard({ task, isCompleted, continuousDays, onEdit }: TaskCardProps) {
  const { completeTask, deleteTask } = useTaskStore()
  const { isParentMode } = useModeStore()
  const { user, setStars, canAddStarsToday } = useStarStore()
  const [showAddEffect, setShowAddEffect] = useState(false)
  const [showRemoveEffect, setShowRemoveEffect] = useState(false)
  const [showLimitWarning, setShowLimitWarning] = useState(false)
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; type: 'star' | 'plus' | 'sparkle' }[]>([])

  const canAdd = canAddStarsToday(task.stars)

  const handleComplete = () => {
    if (!isCompleted) {
      completeTask(task.id)
    }
  }

  const handleDelete = () => {
    if (confirm(`确定要删除任务"${task.name}"吗？`)) {
      deleteTask(task.id)
    }
  }

  const createParticles = (type: 'add' | 'remove') => {
    const newParticles: { id: number; x: number; y: number; type: 'star' | 'plus' | 'sparkle' }[] = []
    for (let i = 0; i < 8; i++) {
      const particleType: 'star' | 'plus' | 'sparkle' = type === 'add' ? (Math.random() > 0.5 ? 'star' : 'sparkle') : 'plus'
      newParticles.push({
        id: Date.now() + i,
        x: 30 + Math.random() * 40,
        y: 20 + Math.random() * 40,
        type: particleType
      })
    }
    setParticles(newParticles)
    setTimeout(() => setParticles([]), 1000)
  }

  const handleAddStars = () => {
    if (!canAdd) {
      setShowLimitWarning(true)
      setTimeout(() => setShowLimitWarning(false), 2000)
      return
    }
    
    let bonusStars = 0
    if (task.isContinuous && continuousDays > 0) {
      if ((continuousDays + 1) % task.continuousDays === 0) {
        bonusStars = 10
      }
    }
    
    const totalStarsToAdd = task.stars + bonusStars
    const newStars = user.currentStars + totalStarsToAdd
    const newTotalStars = user.totalStarsEarned + totalStarsToAdd
    
    setShowAddEffect(true)
    createParticles('add')
    setTimeout(() => setShowAddEffect(false), 500)
    
    setStars(newStars, newTotalStars)
    
    if (bonusStars > 0) {
      setTimeout(() => {
        alert(`🎉 恭喜！连续完成${continuousDays + 1}天，获得额外${bonusStars}分奖励！`)
      }, 600)
    }
  }

  const handleRemoveStars = () => {
    if (user.currentStars <= 0) return
    
    const starsToRemove = Math.min(task.stars, user.currentStars)
    const newStars = user.currentStars - starsToRemove
    const newTotalStars = Math.max(0, user.totalStarsEarned - starsToRemove)
    
    setShowRemoveEffect(true)
    createParticles('remove')
    setTimeout(() => setShowRemoveEffect(false), 500)
    
    setStars(newStars, newTotalStars)
  }

  const daysUntilBonus = task.isContinuous ? task.continuousDays - ((continuousDays || 0) % task.continuousDays) : 0
  const willGetBonus = daysUntilBonus === 1 && task.isContinuous

  return (
    <div
      className={cn(
        'card p-4 flex items-center justify-between transition-all duration-300 relative overflow-hidden',
        isCompleted ? 'bg-green-50/60 border-2 border-green-200' : 'bg-white/80',
        'hover:shadow-xl card-hover'
      )}
    >
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute pointer-events-none animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${Math.random() * 0.3}s`,
            fontSize: particle.type === 'star' ? '20px' : particle.type === 'sparkle' ? '16px' : '18px'
          }}
        >
          {particle.type === 'star' && '⭐'}
          {particle.type === 'sparkle' && '✨'}
          {particle.type === 'plus' && (
            <span className="text-red-400 font-bold">+{task.stars}</span>
          )}
        </div>
      ))}

      {showAddEffect && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-400 font-bold text-xl animate-bounce"
              style={{
                left: `${25 + Math.random() * 50}%`,
                top: `${15 + Math.random() * 50}%`,
                animationDelay: `${i * 80}ms`,
                animationDuration: '0.6s',
              }}
            >
              +{task.stars}
            </div>
          ))}
        </div>
      )}
      
      {showRemoveEffect && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute text-red-400 font-bold text-xl animate-pulse"
              style={{
                left: `${25 + Math.random() * 50}%`,
                top: `${15 + Math.random() * 50}%`,
                animationDelay: `${i * 80}ms`,
                animationDuration: '0.6s',
              }}
            >
              -{task.stars}
            </div>
          ))}
        </div>
      )}

      {showLimitWarning && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow-lg animate-bounce z-10">
          今天的星星已达上限！
        </div>
      )}

      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={handleComplete}
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
            isCompleted
              ? 'bg-green-400 text-white'
              : 'bg-pink-100 text-pink-400 hover:bg-pink-200 hover:scale-110'
          )}
        >
          {isCompleted ? <CheckCircle className="w-6 h-6" /> : <span className="text-lg">+</span>}
        </button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800">{task.name}</span>
            {task.isContinuous && (
              <span className="flex items-center gap-1 text-orange-500 text-xs bg-orange-50 px-2 py-0.5 rounded-full">
                <Flame className="w-3 h-3" />
                连续
              </span>
            )}
            {willGetBonus && (
              <span className="flex items-center gap-1 text-yellow-600 text-xs bg-yellow-100 px-2 py-0.5 rounded-full animate-pulse">
                <Zap className="w-3 h-3" />
                即将获得奖励！
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            {task.isContinuous ? (
              <>
                <span className="text-sm text-gray-500">
                  每次 +<span className="text-pink-500 font-bold">{task.stars}</span> 分
                </span>
                {continuousDays > 0 && (
                  <span className="text-sm text-gray-500">
                    · 已连续 <span className="text-orange-500 font-bold">{continuousDays}</span> 天
                  </span>
                )}
                <span className="text-sm text-green-600">
                  · 连续 <span className="font-bold">{task.continuousDays}</span> 天额外 +10 分
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-500">
                完成获得 <span className="text-pink-500 font-bold">{task.stars}</span> 分
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-0.5 flex-shrink-0">
        <button
          onClick={handleRemoveStars}
          disabled={user.currentStars <= 0}
          className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300',
            user.currentStars > 0 
              ? 'bg-gradient-to-br from-red-100 to-red-200 text-red-500 hover:from-red-200 hover:to-red-300 hover:scale-110 active:scale-95 shadow-md' 
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          )}
        >
          <Minus className="w-3 h-3" />
        </button>
        
        <span className={cn(
          'w-6 text-center font-bold text-sm transition-all duration-300',
          showAddEffect ? 'text-green-500 scale-125' : 'text-yellow-600',
          showRemoveEffect ? 'text-red-500 scale-75' : ''
        )}>
          {task.stars}
        </span>
        
        <button
          onClick={handleAddStars}
          className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300',
            canAdd 
              ? 'bg-gradient-to-br from-green-100 to-green-200 text-green-500 hover:from-green-200 hover:to-green-300 hover:scale-110 active:scale-95 shadow-md' 
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          )}
        >
          <Plus className="w-3 h-3" />
        </button>
        
        {isParentMode && (
          <div className="flex items-center gap-0.5 ml-0.5">
            <button
              onClick={onEdit}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-pink-400 transition-colors"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={handleDelete}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
