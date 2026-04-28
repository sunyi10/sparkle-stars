import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task, TaskType } from '@/types'
import { useTaskStore } from '@/store'

interface TaskFormProps {
  task?: Task | null
  onClose: () => void
}

export function TaskForm({ task, onClose }: TaskFormProps) {
  const { addTask, updateTask } = useTaskStore()
  const [name, setName] = useState('')
  const [stars, setStars] = useState(1)
  const [type, setType] = useState<TaskType>('daily')
  const [isContinuous, setIsContinuous] = useState(false)
  const [continuousDays, setContinuousDays] = useState(7)

  const clampNumber = (value: string, min: number, max: number, defaultValue: number): number => {
    const num = Number(value)
    if (isNaN(num)) return defaultValue
    return Math.max(min, Math.min(max, num))
  }

  useEffect(() => {
    if (task) {
      setName(task.name)
      setStars(task.stars)
      setType(task.type)
      setIsContinuous(task.isContinuous)
      setContinuousDays(task.continuousDays)
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (task) {
      updateTask(task.id, {
        name,
        stars,
        type,
        isContinuous,
        continuousDays: isContinuous ? continuousDays : 0,
      })
    } else {
      addTask({
        name,
        stars,
        type,
        isContinuous,
        continuousDays: isContinuous ? continuousDays : 0,
      })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-pink-400">
            {task ? '编辑任务' : '新增任务'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-pink-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              任务名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              placeholder="输入任务名称"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              任务类型
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('daily')}
                className={cn(
                  'flex-1 py-2 rounded-lg font-medium transition-colors',
                  type === 'daily'
                    ? 'bg-pink-300 text-white'
                    : 'bg-pink-100 text-pink-400 hover:bg-pink-200'
                )}
              >
                日常任务
              </button>
              <button
                type="button"
                onClick={() => setType('habit')}
                className={cn(
                  'flex-1 py-2 rounded-lg font-medium transition-colors',
                  type === 'habit'
                    ? 'bg-pink-300 text-white'
                    : 'bg-pink-100 text-pink-400 hover:bg-pink-200'
                )}
              >
                行为习惯
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              奖励星星数
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={stars}
              onChange={(e) => setStars(clampNumber(e.target.value, 1, 10, 1))}
              className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isContinuous}
                onChange={(e) => setIsContinuous(e.target.checked)}
                className="w-4 h-4 text-pink-400 border-pink-200 rounded"
              />
              <span className="text-sm font-medium text-gray-700">设置为连续性任务</span>
            </label>
          </div>

          {isContinuous && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                连续天数目标
              </label>
              <input
                type="number"
                min="3"
                max="30"
                value={continuousDays}
                onChange={(e) => setContinuousDays(clampNumber(e.target.value, 3, 30, 7))}
                className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-pink-300 text-white rounded-lg font-medium hover:bg-pink-400 transition-colors"
            >
              {task ? '保存' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
