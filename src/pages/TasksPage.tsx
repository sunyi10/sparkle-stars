import { useState } from 'react'
import { Plus, Sun, Heart, AlertTriangle } from 'lucide-react'
import { TaskCard } from '@/components/TaskCard'
import { TaskForm } from '@/components/TaskForm'
import { PenaltyCard } from '@/components/PenaltyCard'
import { PenaltyForm } from '@/components/PenaltyForm'
import { useTaskStore, usePenaltyStore } from '@/store'
import type { Task, TaskType, Penalty } from '@/types'
import { getTodayString } from '@/lib/utils'

type TabType = TaskType | 'penalty'

export function TasksPage() {
  const { tasks, getTodayCompletedTasks, getContinuousDays } = useTaskStore()
  const { penalties } = usePenaltyStore()
  
  const [activeTab, setActiveTab] = useState<TabType>('daily')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showPenaltyForm, setShowPenaltyForm] = useState(false)
  const [editingPenalty, setEditingPenalty] = useState<Penalty | null>(null)

  const filteredTasks = tasks.filter((task) => task.type === activeTab)
  const completedToday = getTodayCompletedTasks()

  const tabs = [
    { id: 'daily' as const, icon: Sun, label: '日常任务' },
    { id: 'habit' as const, icon: Heart, label: '行为习惯' },
    { id: 'penalty' as const, icon: AlertTriangle, label: '扣分项' },
  ]

  const handleAddTask = () => {
    setEditingTask(null)
    setShowTaskForm(true)
  }

  const handleAddPenalty = () => {
    setEditingPenalty(null)
    setShowPenaltyForm(true)
  }

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-pink-400">任务管理</h1>
        {activeTab === 'penalty' ? (
          <button
            onClick={handleAddPenalty}
            className="px-4 py-2 bg-red-400 text-white rounded-full font-bold hover:bg-red-500 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            新增扣分
          </button>
        ) : (
          <button
            onClick={handleAddTask}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            新增任务
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
              activeTab === tab.id
                ? tab.id === 'penalty'
                  ? 'bg-red-400 text-white shadow-lg'
                  : 'bg-pink-300 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'penalty' ? (
        <div className="space-y-3">
          {penalties.map((penalty) => (
            <PenaltyCard
              key={penalty.id}
              penalty={penalty}
              onEdit={() => {
                setEditingPenalty(penalty)
                setShowPenaltyForm(true)
              }}
            />
          ))}
          
          {penalties.length === 0 && (
            <div className="card text-center py-8">
              <span className="text-4xl mb-2 block">⚠️</span>
              <p className="text-gray-500">暂无扣分项</p>
              <button
                onClick={handleAddPenalty}
                className="px-4 py-2 bg-red-400 text-white rounded-full font-bold hover:bg-red-500 transition-colors mt-4"
              >
                添加扣分项
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isCompleted={completedToday.includes(task.id)}
              continuousDays={getContinuousDays(task.id)}
              date={getTodayString()}
              isToday={true}
              onEdit={() => {
                setEditingTask(task)
                setShowTaskForm(true)
              }}
            />
          ))}
          
          {filteredTasks.length === 0 && (
            <div className="card text-center py-8">
              <span className="text-4xl mb-2 block">📋</span>
              <p className="text-gray-500">暂无任务</p>
              <button
                onClick={handleAddTask}
                className="btn-primary mt-4"
              >
                添加任务
              </button>
            </div>
          )}
        </div>
      )}

      {showTaskForm && (
        <TaskForm task={editingTask} onClose={() => {
          setShowTaskForm(false)
          setEditingTask(null)
        }} />
      )}

      {showPenaltyForm && (
        <PenaltyForm penalty={editingPenalty} onClose={() => {
          setShowPenaltyForm(false)
          setEditingPenalty(null)
        }} />
      )}
    </div>
  )
}
