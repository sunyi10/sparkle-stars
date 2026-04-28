import { Star, Lock, Gift } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Gift as GiftType } from '@/types'
import { useGiftStore, useStarStore } from '@/store'

interface GiftCardProps {
  gift: GiftType
}

export function GiftCard({ gift }: GiftCardProps) {
  const { redeemGift } = useGiftStore()
  const { user } = useStarStore()
  const canRedeem = user.currentStars >= gift.crownsRequired

  const handleRedeem = () => {
    if (canRedeem) {
      const success = redeemGift(gift.id)
      if (success) {
        alert(`恭喜你兑换了 "${gift.name}"！`)
      }
    }
  }

  return (
    <div
      className={cn(
        'card p-4 transition-all duration-300 card-hover',
        canRedeem ? 'ring-2 ring-yellow-400' : 'opacity-75'
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center text-2xl',
          canRedeem ? 'bg-gradient-to-br from-yellow-200 to-yellow-300' : 'bg-gray-200'
        )}>
          {canRedeem ? <Gift className="w-6 h-6 text-white" /> : <Lock className="w-6 h-6 text-gray-400" />}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800">{gift.name}</h3>
          <p className="text-sm text-gray-500">{gift.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-yellow-600 font-bold">
          <Star className="w-5 h-5 fill-yellow-500" />
          {gift.crownsRequired}
        </div>
        
        <button
          onClick={handleRedeem}
          disabled={!canRedeem}
          className={cn(
            'px-4 py-2 rounded-full font-medium transition-all duration-300',
            canRedeem
              ? 'bg-yellow-400 text-white hover:bg-yellow-500 hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          )}
        >
          {canRedeem ? '兑换' : `还需 ${gift.crownsRequired - user.currentStars} 颗星星`}
        </button>
      </div>
    </div>
  )
}
