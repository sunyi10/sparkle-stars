import { Star, AlertTriangle, Edit2, Trash2 } from 'lucide-react'
import type { Penalty } from '@/types'
import { usePenaltyStore, useStarStore } from '@/store'

interface PenaltyCardProps {
  penalty: Penalty
  onEdit: () => void
}

export function PenaltyCard({ penalty, onEdit }: PenaltyCardProps) {
  const { applyPenalty, deletePenalty } = usePenaltyStore()
  const { user } = useStarStore()

  const handleApply = () => {
    if (user.currentStars < penalty.stars) {
      alert(`星星不足！当前只有 ${user.currentStars} 颗星星`)
      return
    }
    
    if (confirm(`确定要扣除 ${penalty.stars} 颗星星吗？原因：${penalty.name}`)) {
      const success = applyPenalty(penalty.id)
      if (success) {
        alert(`已扣除 ${penalty.stars} 颗星星`)
      }
    }
  }

  const handleDelete = () => {
    if (confirm(`确定要删除扣分项"${penalty.name}"吗？`)) {
      deletePenalty(penalty.id)
    }
  }

  return (
    <div className="card p-4 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-red-400" />
        </div>
        
        <div className="flex-1">
          <div className="font-medium text-gray-800">{penalty.name}</div>
          <div className="text-sm text-gray-500">{penalty.description}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-red-400 font-bold">
          <Star className="w-5 h-5 fill-red-400" />
          -{penalty.stars}
        </div>
        
        <button
          onClick={onEdit}
          className="p-2 text-gray-400 hover:text-pink-400 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        
        <button
          onClick={handleDelete}
          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        
        <button
          onClick={handleApply}
          className="px-3 py-1.5 bg-red-100 text-red-500 rounded-full text-sm font-medium hover:bg-red-200 transition-colors"
        >
          扣除
        </button>
      </div>
    </div>
  )
}
