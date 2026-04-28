import { useRef, useEffect } from 'react'
import { Star, Crown } from 'lucide-react'
import { useStarStore } from '@/store'

interface CalendarViewProps {
  selectedDate: string
  onDateChange: (date: string) => void
}

export function CalendarView({ selectedDate, onDateChange }: CalendarViewProps) {
  const { getStarsByDate, user } = useStarStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  const today = new Date()
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const generateDates = () => {
    const dates: { date: string; day: number; month: number; isToday: boolean; isPast: boolean; stars: number }[] = []
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - 60)

    for (let i = 0; i < 121; i++) {
      const current = new Date(startDate)
      current.setDate(startDate.getDate() + i)
      const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`
      dates.push({
        date: dateStr,
        day: current.getDate(),
        month: current.getMonth() + 1,
        isToday: dateStr === todayString,
        isPast: current < today && dateStr !== todayString,
        stars: getStarsByDate(dateStr),
      })
    }
    return dates
  }

  const dates = generateDates()

  const getStarsRemaining = () => {
    const crownsEarned = Math.floor(user.totalStarsEarned / 100)
    const nextCrownStars = (crownsEarned + 1) * 100
    return nextCrownStars - user.totalStarsEarned
  }

  useEffect(() => {
    if (scrollRef.current) {
      const todayIndex = dates.findIndex(d => d.isToday)
      if (todayIndex !== -1) {
        const scrollPosition = todayIndex * 64 - scrollRef.current.offsetWidth / 2 + 28
        scrollRef.current.scrollTo({ left: Math.max(0, scrollPosition), behavior: 'smooth' })
      }
    }
  }, [])

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <div className="flex items-center justify-center mb-3">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          <span className="text-sm text-gray-600">
            每 <span className="font-bold text-pink-500">100</span> 分解锁皇冠 · 
            还差 <span className="font-bold text-pink-500">{getStarsRemaining()}</span> 分
          </span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {dates.map((item) => {
          const isSelected = item.date === selectedDate
          const hasStars = item.stars > 0
          
          return (
            <button
              key={item.date}
              onClick={() => onDateChange(item.date)}
              className={`flex-shrink-0 w-14 h-20 rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-gradient-to-br from-pink-400 to-purple-400 text-white ring-2 ring-pink-500 scale-105'
                  : item.isToday
                  ? 'bg-gradient-to-br from-pink-100 to-pink-200 text-pink-600 ring-2 ring-pink-300'
                  : item.isPast && hasStars
                  ? 'bg-gradient-to-br from-yellow-100 to-orange-100 text-orange-600'
                  : item.isPast
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-pink-300'
              }`}
            >
              <span className="text-xs opacity-75">{item.month}月</span>
              <span className="text-lg font-bold">{item.day}</span>
              {hasStars && (
                <span className="flex items-center gap-0.5 text-xs mt-1">
                  <Star className={`w-3 h-3 ${isSelected ? 'fill-white text-white' : 'fill-yellow-400 text-yellow-400'}`} />
                  {item.stars}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
