import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Penalty } from '@/types'
import { usePenaltyStore } from '@/store'

interface PenaltyFormProps {
  penalty?: Penalty | null
  onClose: () => void
}

export function PenaltyForm({ penalty, onClose }: PenaltyFormProps) {
  const { addPenalty, updatePenalty } = usePenaltyStore()
  const [name, setName] = useState('')
  const [stars, setStars] = useState(1)
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (penalty) {
      setName(penalty.name)
      setStars(penalty.stars)
      setDescription(penalty.description)
    }
  }, [penalty])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (penalty) {
      updatePenalty(penalty.id, {
        name,
        stars,
        description,
      })
    } else {
      addPenalty({
        name,
        stars,
        description,
      })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-red-400">
            {penalty ? '编辑扣分项' : '新增扣分项'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              扣分项名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-transparent"
              placeholder="输入扣分项名称"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              扣除星星数: {stars}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={stars}
              onChange={(e) => setStars(Number(e.target.value))}
              className="w-full accent-red-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              描述（可选）
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-transparent"
              placeholder="输入扣分项描述"
              rows={2}
            />
          </div>

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
              className="flex-1 py-2 px-4 bg-red-400 text-white rounded-lg font-medium hover:bg-red-500 transition-colors"
            >
              {penalty ? '保存' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
