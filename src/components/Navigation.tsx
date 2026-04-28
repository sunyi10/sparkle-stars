import { Home, Gift, User, ListTodo } from 'lucide-react'
import { cn } from '@/lib/utils'

type TabType = 'home' | 'tasks' | 'rewards' | 'profile'

interface NavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  isParentMode: boolean
}

export function Navigation({ activeTab, onTabChange, isParentMode }: NavigationProps) {
  const tabs = isParentMode
    ? [
        { id: 'home' as const, icon: Home, label: '首页' },
        { id: 'tasks' as const, icon: ListTodo, label: '任务' },
        { id: 'rewards' as const, icon: Gift, label: '兑换' },
        { id: 'profile' as const, icon: User, label: '我的' },
      ]
    : [
        { id: 'home' as const, icon: Home, label: '首页' },
        { id: 'rewards' as const, icon: Gift, label: '兑换' },
        { id: 'profile' as const, icon: User, label: '我的' },
      ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-lg border-t border-pink-100">
      <div className="max-w-md mx-auto flex justify-around py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300',
              activeTab === tab.id
                ? 'text-pink-400'
                : 'text-gray-400 hover:text-pink-300'
            )}
          >
            <tab.icon className={cn(
              'w-6 h-6 transition-all duration-300',
              activeTab === tab.id && 'scale-110'
            )} />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
