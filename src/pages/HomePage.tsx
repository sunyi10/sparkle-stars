import { useState } from 'react'
import { Star, Crown } from 'lucide-react'
import { CalendarView } from '@/components/CalendarView'
import { TaskCard } from '@/components/TaskCard'
import { useStarStore, useTaskStore } from '@/store'
import { getTodayString } from '@/lib/utils'

export function HomePage() {
  const [selectedDate, setSelectedDate] = useState(getTodayString())
  const { user } = useStarStore()
  const { tasks, getCompletedTasksByDate, getContinuousDays } = useTaskStore()

  const todayString = getTodayString()
  
  const completedTaskIds = getCompletedTasksByDate(selectedDate)
  
  const selectedDateCompleted = tasks
    .map(t => {
      const completed = completedTaskIds.includes(t.id)
      const continuousDays = getContinuousDays(t.id)
      return { task: t, isCompleted: completed, continuousDays, selectedDate }
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

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />
            {selectedDate === todayString ? '今天攒星星' : `${formatDateDisplay(selectedDate)} 的星星任务`}
          </h2>
          <span className="text-sm text-gray-500">
            已完成 {selectedDateCompleted.filter(c => c.isCompleted).length} 个任务
          </span>
        </div>
        
        <div className="space-y-2">
          {selectedDateCompleted.map(({ task, isCompleted, continuousDays, selectedDate: taskDate }) => {
            const isContinuous = task.isContinuous && continuousDays > 0
            return (
              <TaskCard
                key={task.id}
                task={task}
                isCompleted={isCompleted}
                continuousDays={isContinuous ? continuousDays : 0}
                date={taskDate}
                isToday={taskDate === todayString}
                onEdit={() => {}}
              />
            )
          })}
        </div>
      </div>

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
