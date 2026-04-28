import { useState } from 'react'
import { Star, Crown, Lock } from 'lucide-react'
import { CalendarView } from '@/components/CalendarView'
import { TaskCard } from '@/components/TaskCard'
import { useStarStore, useTaskStore } from '@/store'
import { getTodayString } from '@/lib/utils'

export function HomePage() {
  const [selectedDate, setSelectedDate] = useState(getTodayString())
  const { user, getStarsByDate } = useStarStore()
  const { tasks, getTodayCompletedTasks, getContinuousDays } = useTaskStore()

  const todayString = getTodayString()
  const isPastDate = selectedDate < todayString

  const dateStars = getStarsByDate(selectedDate)
  
  const selectedDateCompleted = tasks
    .filter(t => t.type === 'daily')
    .map(t => {
      const completed = getTodayCompletedTasks().includes(t.id)
      const continuousDays = getContinuousDays(t.id)
      return { task: t, isCompleted: completed, continuousDays }
    })

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weekDay = weekDays[date.getDay()]
    
    if (dateStr === todayString) {
      return '今天'
    }
    
    const todayDate = new Date(todayString)
    const diffDays = Math.floor((date.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '明天'
    if (diffDays === -1) return '昨天'
    if (diffDays === 2) return '后天'
    if (diffDays === -2) return '前天'
    
    return `${month}月${day}日 ${weekDay}`
  }

  const starsRemaining = ((Math.floor(user.totalStarsEarned / 100) + 1) * 100) - user.totalStarsEarned

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl p-4 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">星星大作战</h1>
            <p className="text-pink-100 text-sm">小公主的习惯养成之旅</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-yellow-400/90 rounded-full px-4 py-2">
              <Star className="w-5 h-5 fill-yellow-200" />
              <span className="font-bold text-xl">{user.currentStars}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-2">
              <Crown className="w-5 h-5" />
              <span className="font-bold">{user.crowns}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-full p-3 shadow-md">
            <Crown className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">距离下一个皇冠还差</p>
            <p className="font-bold text-gray-800">
              <span className="text-pink-500 text-2xl">{starsRemaining}</span> 积分
            </p>
          </div>
          <div className="text-4xl">👑</div>
        </div>
      </div>

      <CalendarView selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {isPastDate ? (
        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            {formatDateDisplay(selectedDate)} 的积分情况
          </h2>
          
          {dateStars > 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-4xl font-bold text-pink-500 mb-2">{dateStars}</p>
              <p className="text-gray-500">当天获得的星星数量</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">😴</div>
              <p className="text-gray-500">当天没有获得星星</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />
              {selectedDate === todayString ? '今天攒星星' : `${formatDateDisplay(selectedDate)} 的星星任务`}
            </h2>
            {selectedDate === todayString && (
              <span className="text-sm text-gray-500">
                已完成 {selectedDateCompleted.filter(c => c.isCompleted).length} 个任务
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            {selectedDate === todayString ? (
              selectedDateCompleted.map(({ task, isCompleted, continuousDays }) => {
                const isContinuous = task.isContinuous && continuousDays > 0
                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isCompleted={isCompleted}
                    continuousDays={isContinuous ? continuousDays : 0}
                    onEdit={() => {}}
                  />
                )
              })
            ) : (
              tasks.filter(t => t.type === 'daily').map(task => (
                <div
                  key={task.id}
                  className="card p-4 flex items-center justify-between bg-white/80"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">{task.name}</h3>
                      <p className="text-sm text-gray-400">
                        完成可获得 <span className="text-yellow-500">{task.stars}</span> 颗星星
                        {task.isContinuous && `，连续${task.continuousDays}天额外+10分`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gold-100 font-bold">
                    <Star className="w-5 h-5 fill-gold-100" />
                    {task.stars}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {user.crowns >= 1 && (
        <div className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">🎁</div>
          <p className="font-bold text-gray-800">解锁皇冠可获得神秘大奖！</p>
          <p className="text-sm text-gray-600 mt-1">累计200积分即可获得皇冠勋章</p>
        </div>
      )}
    </div>
  )
}
