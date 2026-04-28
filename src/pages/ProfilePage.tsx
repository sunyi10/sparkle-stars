import { Calendar, Settings, User, Lock, Unlock, RotateCcw, TrendingUp, Sparkles, Award, Target, RefreshCw } from 'lucide-react'
import { MedalBadge } from '@/components/MedalBadge'
import { useStarStore, useMedalStore, useModeStore, useTaskStore } from '@/store'
import { useState } from 'react'

interface ProfilePageProps {
  onEnterParentMode?: () => void
}

export function ProfilePage({ onEnterParentMode }: ProfilePageProps) {
  const { user, getStarsToday, getStarsThisWeek, refundCrown, getStarsByDate } = useStarStore()
  const { medals } = useMedalStore()
  const { isParentMode, switchToChildMode } = useModeStore()
  const { resetTodayProgress } = useTaskStore()
  const [refundAmount, setRefundAmount] = useState(1)

  const avgDailyStars = user.totalStarsEarned > 0 && user.consecutiveDays > 0
    ? Math.round(user.totalStarsEarned / user.consecutiveDays)
    : 0

  const getWeekData = () => {
    const days = ['日', '一', '二', '三', '四', '五', '六']
    const today = new Date()
    const weekData = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      const stars = getStarsByDate(dateStr)
      weekData.push({
        day: days[date.getDay()],
        stars,
        isToday: i === 0
      })
    }
    return weekData
  }

  const weekData = getWeekData()
  const maxStars = Math.max(...weekData.map(d => d.stars), 1)

  const handleModeSwitch = () => {
    if (isParentMode) {
      switchToChildMode()
    } else if (onEnterParentMode) {
      onEnterParentMode()
    }
  }

  const handleRefundCrown = () => {
    if (user.crowns < refundAmount) {
      alert('皇冠数量不足！')
      return
    }
    if (confirm(`确定要回收 ${refundAmount} 个皇冠吗？将返还 ${refundAmount * 100} 颗星星`)) {
      refundCrown(refundAmount)
    }
  }

  return (
    <div className="p-4 pb-24">
      <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl p-4 text-white shadow-lg mb-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">{user.name}</h2>
            <p className="text-pink-100 text-xs">一年级小勇士</p>
          </div>
        </div>
      </div>

      <div className="card mb-6 overflow-hidden">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-pink-400" />
          本周星星趋势
        </h2>
        
        <div className="flex justify-between items-end h-40 px-2">
          {weekData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="w-8 rounded-t-lg transition-all duration-500 hover:scale-110"
                style={{
                  height: `${(item.stars / maxStars) * 120}px`,
                  background: item.isToday 
                    ? 'linear-gradient(to top, #f472b6, #ec4899)' 
                    : item.stars > 0 
                      ? 'linear-gradient(to top, #fcd34d, #f59e0b)' 
                      : '#f3f4f6'
                }}
              />
              <span className={`text-xs mt-2 ${item.isToday ? 'text-pink-500 font-bold' : 'text-gray-500'}`}>
                {item.day}
              </span>
              {item.stars > 0 && (
                <span className="text-xs text-yellow-600 font-bold">{item.stars}</span>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-around mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-yellow-500">
              <Sparkles className="w-4 h-4" />
              <span className="text-lg font-bold">{getStarsToday()}</span>
            </div>
            <span className="text-xs text-gray-500">今日</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-purple-500">
              <Calendar className="w-4 h-4" />
              <span className="text-lg font-bold">{getStarsThisWeek()}</span>
            </div>
            <span className="text-xs text-gray-500">本周</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-500">
              <Target className="w-4 h-4" />
              <span className="text-lg font-bold">{avgDailyStars}</span>
            </div>
            <span className="text-xs text-gray-500">日均</span>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-gold-100" />
          我的成就
        </h2>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <p className="text-2xl font-bold text-orange-500">{user.totalStarsEarned}</p>
            <p className="text-xs text-gray-500">累计星星</p>
          </div>
          <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">👑</div>
            <p className="text-2xl font-bold text-purple-500">{user.crowns}</p>
            <p className="text-xs text-gray-500">皇冠勋章</p>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-teal-100 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <p className="text-2xl font-bold text-teal-500">{user.consecutiveDays}</p>
            <p className="text-xs text-gray-500">连续天数</p>
          </div>
        </div>
      </div>

      {isParentMode && user.crowns > 0 && (
        <div className="card mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-orange-500" />
            皇冠回收
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                回收皇冠数量: {refundAmount}
              </label>
              <input
                type="range"
                min="1"
                max={user.crowns}
                value={refundAmount}
                onChange={(e) => setRefundAmount(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
              <p className="text-sm text-gray-500 mt-2">
                将返还 <span className="font-bold text-pink-500">{refundAmount * 100}</span> 颗星星
              </p>
            </div>
            <button
              onClick={handleRefundCrown}
              className="px-4 py-2 bg-orange-400 text-white rounded-lg font-medium hover:bg-orange-500 transition-colors"
            >
              回收
            </button>
          </div>
        </div>
      )}

      <div className="card mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>👑</span> 我的皇冠勋章
        </h2>
        <div className="flex justify-around">
          {medals.map((medal) => (
            <MedalBadge key={medal.id} medal={medal} currentStars={user.totalStarsEarned} />
          ))}
        </div>
        {user.crowns > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              已获得 <span className="font-bold text-yellow-600">{user.crowns}</span> 个皇冠
            </p>
            <p className="text-xs text-gray-400">每100积分可获得1个皇冠</p>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-400" />
          设置
        </h2>
        
        <div className="space-y-4">
          <button
            onClick={handleModeSwitch}
            className="w-full flex items-center justify-between py-3 border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                {isParentMode ? (
                  <Unlock className="w-5 h-5 text-pink-400" />
                ) : (
                  <Lock className="w-5 h-5 text-pink-400" />
                )}
              </div>
              <span className="text-gray-700">{isParentMode ? '儿童模式' : '家长模式'}</span>
            </div>
            <span className={`text-sm ${!isParentMode ? 'text-pink-400' : 'text-gray-400'}`}>
              {!isParentMode ? '已开启' : '点击进入'}
            </span>
          </button>
          
          {isParentMode && (
            <button
              onClick={() => {
                if (confirm('确定要重置今天的任务进度和积分吗？所有今天获得的星星将被扣除。')) {
                  resetTodayProgress()
                }
              }}
              className="w-full flex items-center justify-between py-3 border-b border-gray-100 last:border-0 text-red-500"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-red-400" />
                </div>
                <span className="text-gray-700">重置今天进度</span>
              </div>
              <span className="text-sm text-gray-400">积分归零</span>
            </button>
          )}
          
          <div className="text-center text-gray-400 text-sm py-4">
            星星大作战 v1.0
          </div>
        </div>
      </div>
    </div>
  )
}
