import { useState } from 'react'
import { Star, Gift, History, Plus, Edit2, Trash2, X, Crown } from 'lucide-react'
import { useGiftStore, useStarStore, useModeStore } from '@/store'
import type { Gift as GiftType, GiftRedeemType } from '@/types'

export function RewardsPage() {
  const { gifts, redemptions, addGift, updateGift, deleteGift, redeemGift } = useGiftStore()
  const { user } = useStarStore()
  const { isParentMode } = useModeStore()

  const [showGiftForm, setShowGiftForm] = useState(false)
  const [editingGift, setEditingGift] = useState<GiftType | null>(null)
  const [giftName, setGiftName] = useState('')
  const [giftStars, setGiftStars] = useState(10)
  const [giftCrowns, setGiftCrowns] = useState(1)
  const [giftRedeemType, setGiftRedeemType] = useState<GiftRedeemType>('stars')
  const [giftDescription, setGiftDescription] = useState('')

  const clampNumber = (value: string, min: number, max: number, defaultValue: number): number => {
    const num = Number(value)
    if (isNaN(num)) return defaultValue
    return Math.max(min, Math.min(max, num))
  }

  const starsGifts = gifts.filter(g => g.redeemType === 'stars').sort((a, b) => a.starsRequired - b.starsRequired)
  const crownsGifts = gifts.filter(g => g.redeemType === 'crowns').sort((a, b) => a.crownsRequired - b.crownsRequired)
  
  const recentRedemptions = [...redemptions]
    .sort((a, b) => new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime())
    .slice(0, 5)

  const handleOpenGiftForm = (gift?: GiftType | null) => {
    if (gift) {
      setEditingGift(gift)
      setGiftName(gift.name)
      setGiftStars(gift.starsRequired)
      setGiftCrowns(gift.crownsRequired)
      setGiftRedeemType(gift.redeemType)
      setGiftDescription(gift.description || '')
    } else {
      setEditingGift(null)
      setGiftName('')
      setGiftStars(10)
      setGiftCrowns(1)
      setGiftRedeemType('stars')
      setGiftDescription('')
    }
    setShowGiftForm(true)
  }

  const handleSubmitGift = (e: React.FormEvent) => {
    e.preventDefault()
    if (!giftName.trim()) return

    if (editingGift) {
      updateGift(editingGift.id, {
        name: giftName,
        starsRequired: giftRedeemType === 'stars' ? giftStars : 0,
        crownsRequired: giftRedeemType === 'crowns' ? giftCrowns : 0,
        redeemType: giftRedeemType,
        description: giftDescription,
      })
    } else {
      addGift({
        name: giftName,
        starsRequired: giftRedeemType === 'stars' ? giftStars : 0,
        crownsRequired: giftRedeemType === 'crowns' ? giftCrowns : 0,
        redeemType: giftRedeemType,
        description: giftDescription,
      })
    }
    setShowGiftForm(false)
  }

  const handleDeleteGift = (gift: GiftType) => {
    if (confirm(`确定要删除礼品"${gift.name}"吗？`)) {
      deleteGift(gift.id)
    }
  }

  const handleRedeemGift = (gift: GiftType) => {
    const canRedeem = gift.redeemType === 'stars' 
      ? user.currentStars >= gift.starsRequired
      : user.crowns >= gift.crownsRequired

    if (!canRedeem) {
      const needed = gift.redeemType === 'stars' 
        ? gift.starsRequired - user.currentStars
        : gift.crownsRequired - user.crowns
      const unit = gift.redeemType === 'stars' ? '星星' : '皇冠'
      alert(`${unit}不足！还需要 ${needed} 个${unit}`)
      return
    }
    
    const cost = gift.redeemType === 'stars' ? gift.starsRequired : gift.crownsRequired
    const unit = gift.redeemType === 'stars' ? '星星' : '皇冠'
    
    if (confirm(`确定要兑换 "${gift.name}" 吗？需要消耗 ${cost} 个${unit}`)) {
      const success = redeemGift(gift.id)
      if (success) {
        alert(`恭喜你兑换了 "${gift.name}"！`)
      }
    }
  }

  const [activeTab, setActiveTab] = useState<'stars' | 'crowns'>('stars')

  return (
    <div className="p-4 pb-24">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-pink-400 mb-2">礼品兑换</h1>
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-yellow-200 px-4 py-2 rounded-full">
            <Star className="w-6 h-6 text-yellow-600 fill-yellow-500" />
            <span className="font-bold text-xl text-yellow-700">{user.currentStars}</span>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full">
            <Crown className="w-5 h-5 text-purple-600" />
            <span className="font-bold text-xl text-purple-700">{user.crowns}</span>
          </div>
        </div>
      </div>

      <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
        <button
          onClick={() => setActiveTab('stars')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === 'stars'
              ? 'bg-white text-yellow-600 shadow-md'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Star className="w-5 h-5" />
          星星兑换
        </button>
        <button
          onClick={() => setActiveTab('crowns')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === 'crowns'
              ? 'bg-white text-purple-600 shadow-md'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Crown className="w-5 h-5" />
          皇冠兑换
        </button>
      </div>

      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            {activeTab === 'stars' ? (
              <Star className="w-5 h-5 text-yellow-500" />
            ) : (
              <Crown className="w-5 h-5 text-purple-500" />
            )}
            {activeTab === 'stars' ? '星星兑换区' : '皇冠兑换区'}
          </h2>
          {isParentMode && activeTab === 'stars' && (
            <button
              onClick={() => handleOpenGiftForm()}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加礼品
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          {(activeTab === 'stars' ? starsGifts : crownsGifts).map((gift) => {
            const canRedeem = activeTab === 'stars' 
              ? user.currentStars >= gift.starsRequired
              : user.crowns >= gift.crownsRequired
            return (
              <div
                key={gift.id}
                className={`card p-4 transition-all duration-300 ${canRedeem ? (activeTab === 'stars' ? 'ring-2 ring-yellow-400' : 'ring-2 ring-purple-400') : 'opacity-75'}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    canRedeem ? (activeTab === 'stars' ? 'bg-gradient-to-br from-yellow-200 to-yellow-300' : 'bg-gradient-to-br from-purple-200 to-pink-300') : 'bg-gray-200'
                  }`}>
                    {gift.image ? (
                      <img src={gift.image} alt={gift.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <Gift className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-800">{gift.name}</h3>
                      {isParentMode && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenGiftForm(gift)}
                            className="p-1 text-gray-400 hover:text-pink-400 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteGift(gift)}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{gift.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-1 font-bold ${activeTab === 'stars' ? 'text-yellow-600' : 'text-purple-600'}`}>
                    {activeTab === 'stars' ? (
                      <Star className="w-5 h-5 fill-yellow-500" />
                    ) : (
                      <Crown className="w-5 h-5" />
                    )}
                    {activeTab === 'stars' ? gift.starsRequired : gift.crownsRequired}
                  </div>
                  
                  <button
                    onClick={() => handleRedeemGift(gift)}
                    disabled={!canRedeem}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      canRedeem
                        ? (activeTab === 'stars' ? 'bg-yellow-400 text-white hover:bg-yellow-500 hover:scale-105' : 'bg-purple-400 text-white hover:bg-purple-500 hover:scale-105')
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {canRedeem ? '兑换' : `还需 ${activeTab === 'stars' ? gift.starsRequired - user.currentStars : gift.crownsRequired - user.crowns} ${activeTab === 'stars' ? '颗星星' : '个皇冠'}`}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {recentRedemptions.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-pink-400" />
            兑换记录
          </h2>
          
          <div className="space-y-2">
            {recentRedemptions.map((redemption) => {
              const gift = gifts.find(g => g.id === redemption.giftId)
              const date = new Date(redemption.redeemedAt)
              const formattedDate = `${date.getMonth() + 1}月${date.getDate()}日`
              
              return (
                <div key={redemption.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎁</span>
                    <span className="text-gray-700">{gift?.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {gift?.redeemType === 'stars' ? (
                      <>
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-600" />
                        <span className="text-yellow-600">{gift?.starsRequired}</span>
                      </>
                    ) : (
                      <>
                        <Crown className="w-4 h-4 text-purple-600" />
                        <span className="text-purple-600">{redemption.crownsUsed}</span>
                      </>
                    )}
                    <span className="text-gray-400 ml-2">{formattedDate}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {showGiftForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-pink-400">
                {editingGift ? '编辑礼品' : '添加礼品'}
              </h2>
              <button
                onClick={() => setShowGiftForm(false)}
                className="p-2 hover:bg-pink-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmitGift} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  礼品名称
                </label>
                <input
                  type="text"
                  value={giftName}
                  onChange={(e) => setGiftName(e.target.value)}
                  className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  placeholder="输入礼品名称"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  兑换方式
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setGiftRedeemType('stars')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      giftRedeemType === 'stars'
                        ? 'bg-yellow-400 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4" />
                      星星兑换
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGiftRedeemType('crowns')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      giftRedeemType === 'crowns'
                        ? 'bg-purple-400 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Crown className="w-4 h-4" />
                      皇冠兑换
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  需要{giftRedeemType === 'stars' ? '星星' : '皇冠'}数
                </label>
                <input
                  type="number"
                  min="1"
                  max={giftRedeemType === 'stars' ? 500 : 20}
                  value={giftRedeemType === 'stars' ? giftStars : giftCrowns}
                  onChange={(e) => {
                    if (giftRedeemType === 'stars') {
                      setGiftStars(clampNumber(e.target.value, 1, 500, 10))
                    } else {
                      setGiftCrowns(clampNumber(e.target.value, 1, 20, 1))
                    }
                  }}
                  className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  描述（可选）
                </label>
                <textarea
                  value={giftDescription}
                  onChange={(e) => setGiftDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  placeholder="输入礼品描述"
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGiftForm(false)}
                  className="flex-1 py-2 px-4 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-pink-300 text-white rounded-lg font-medium hover:bg-pink-400 transition-colors"
                >
                  {editingGift ? '保存' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
