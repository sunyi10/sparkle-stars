import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Medal } from '@/types'

interface MedalBadgeProps {
  medal: Medal
  currentStars: number
}

export function MedalBadge({ medal, currentStars }: MedalBadgeProps) {
  const progress = Math.min((currentStars / medal.starsRequired) * 100, 100)
  const remaining = Math.max(medal.starsRequired - currentStars, 0)

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          'medal-badge',
          medal.isUnlocked ? 'medal-unlocked' : 'medal-locked'
        )}
      >
        {medal.isUnlocked ? (
          medal.image ? (
            <img
              src={medal.image}
              alt={medal.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <span className="text-3xl animate-bounce-slow">{medal.icon}</span>
          )
        ) : (
          <Lock className="w-6 h-6 text-gray-400" />
        )}
      </div>
      
      <div className="text-center">
        <div className="font-bold text-gray-700 text-sm">{medal.name}</div>
        {!medal.isUnlocked && (
          <div className="text-xs text-gray-500">
            还需 {remaining} 颗星星
          </div>
        )}
      </div>
      
      {!medal.isUnlocked && (
        <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-300 to-pink-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
