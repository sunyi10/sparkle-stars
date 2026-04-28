import { useState, useRef } from 'react'
import { Flame, Check, Edit2, Trash2, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'
import { useTaskStore, useModeStore, useStarStore } from '@/store'

interface TaskCardProps {
  task: Task
  isCompleted: boolean
  continuousDays: number
  date: string
  isToday: boolean
  onEdit: () => void
}

export function TaskCard({ task, isCompleted, continuousDays, date, isToday, onEdit }: TaskCardProps) {
  const { deleteTask, completeTask, undoCompleteTask, getContinuousDays } = useTaskStore()
  const { isParentMode } = useModeStore()
  const { canAddStarsToday } = useStarStore()
  const [showAddEffect, setShowAddEffect] = useState(false)
  const [showRemoveEffect, setShowRemoveEffect] = useState(false)
  const [showLimitWarning, setShowLimitWarning] = useState(false)
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; type: 'star' | 'sparkle' }[]>([])
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const longPressTriggered = useRef(false)

  const canAdd = canAddStarsToday(task.stars)

  const handleDelete = () => {
    if (confirm(`确定要删除任务"${task.name}"吗？`)) {
      deleteTask(task.id)
    }
  }

  const createParticles = (type: 'add' | 'remove') => {
    const newParticles: { id: number; x: number; y: number; type: 'star' | 'sparkle' }[] = []
    for (let i = 0; i < 8; i++) {
      const particleType: 'star' | 'sparkle' = type === 'add' ? (Math.random() > 0.5 ? 'star' : 'sparkle') : 'sparkle'
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

  const handleCompleteTask = () => {
    if (isCompleted) return
    
    if (!isToday) return
    
    if (!canAdd) {
      setShowLimitWarning(true)
      setTimeout(() => setShowLimitWarning(false), 2000)
      return
    }
    
    setShowAddEffect(true)
    createParticles('add')
    setTimeout(() => setShowAddEffect(false), 500)
    
    completeTask(task.id)
    
    const newContinuousDays = getContinuousDays(task.id)
    if (task.isContinuous && newContinuousDays > 0 && newContinuousDays % task.continuousDays === 0) {
      setTimeout(() => {
        alert(`🎉 恭喜！连续完成${newContinuousDays}天，获得额外10分奖励！`)
      }, 600)
    }
  }

  const handleUndoTask = () => {
    if (!isCompleted) return
    
    if (!isToday) return
    
    setShowRemoveEffect(true)
    createParticles('remove')
    setTimeout(() => setShowRemoveEffect(false), 500)
    
    undoCompleteTask(task.id, date)
  }

  const handleMouseDown = () => {
    longPressTriggered.current = false
    longPressTimer.current = setTimeout(() => {
      if (isCompleted && isToday) {
        longPressTriggered.current = true
        handleUndoTask()
      }
    }, 500)
  }

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
    if (!longPressTriggered.current) {
      handleCompleteTask()
    }
  }

  const handleMouseLeave = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
  }

  const handleTouchStart = () => {
    longPressTriggered.current = false
    longPressTimer.current = setTimeout(() => {
      if (isCompleted && isToday) {
        longPressTriggered.current = true
        handleUndoTask()
      }
    }, 500)
  }

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
    if (!longPressTriggered.current) {
      handleCompleteTask()
    }
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
            fontSize: particle.type === 'star' ? '20px' : '16px'
          }}
        >
          {particle.type === 'star' && '⭐'}
          {particle.type === 'sparkle' && '✨'}
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

      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-gray-800 truncate">{task.name}</span>
            {task.isContinuous && (
              <span className="flex items-center gap-1 text-orange-500 text-xs bg-orange-50 px-2 py-0.5 rounded-full flex-shrink-0">
                <Flame className="w-3 h-3" />
                连续
              </span>
            )}
            {willGetBonus && (
              <span className="flex items-center gap-1 text-yellow-600 text-xs bg-yellow-100 px-2 py-0.5 rounded-full animate-pulse flex-shrink-0">
                <Zap className="w-3 h-3" />
                即将获得奖励！
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {task.isContinuous ? (
              <>
                <span className="text-xs text-gray-500">
                  每次 +<span className="text-pink-500 font-bold">{task.stars}</span> 分
                </span>
                {continuousDays > 0 && (
                  <span className="text-xs text-gray-500">
                    · 已连续 <span className="text-orange-500 font-bold">{continuousDays}</span> 天
                  </span>
                )}
                <span className="text-xs text-green-600">
                  · 连续 <span className="font-bold">{task.continuousDays}</span> 天 +10 分
                </span>
              </>
            ) : (
              <span className="text-xs text-gray-500">
                完成 +<span className="text-pink-500 font-bold">{task.stars}</span> 分
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
        <button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 select-none',
            isCompleted 
              ? 'bg-gradient-to-br from-green-400 to-green-500 text-white shadow-md' 
              : isToday 
                ? canAdd 
                  ? 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:scale-110 active:scale-95' 
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                : 'bg-gray-50 text-gray-300 cursor-not-allowed'
          )}
          title={isCompleted ? (isToday ? '长按取消' : '') : (isToday ? '点击完成' : '')}
          disabled={!isToday}
        >
          <Check className="w-5 h-5" />
        </button>
        
        {isParentMode && (
          <div className="flex items-center gap-0.5 ml-1">
            <button
              onClick={onEdit}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-pink-400 transition-colors"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={handleDelete}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
