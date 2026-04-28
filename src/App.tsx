import { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { HomePage } from '@/pages/HomePage'
import { TasksPage } from '@/pages/TasksPage'
import { RewardsPage } from '@/pages/RewardsPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { PasswordPage } from '@/pages/PasswordPage'
import { useModeStore } from '@/store'

type TabType = 'home' | 'tasks' | 'rewards' | 'profile'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [showPasswordPage, setShowPasswordPage] = useState(false)
  const { isParentMode } = useModeStore()

  const renderPage = () => {
    if (showPasswordPage) {
      return <PasswordPage onSuccess={() => {
        setShowPasswordPage(false)
        setActiveTab('tasks')
      }} onCancel={() => setShowPasswordPage(false)} />
    }

    switch (activeTab) {
      case 'home':
        return <HomePage />
      case 'tasks':
        if (!isParentMode) {
          setShowPasswordPage(true)
          return null
        }
        return <TasksPage />
      case 'rewards':
        return <RewardsPage />
      case 'profile':
        return <ProfilePage onEnterParentMode={() => setShowPasswordPage(true)} />
      default:
        return <HomePage />
    }
  }

  const handleTabChange = (tab: TabType) => {
    if (tab === 'tasks' && !isParentMode) {
      setShowPasswordPage(true)
    } else {
      setActiveTab(tab)
    }
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gradient-to-br from-pink-50 via-purple-light to-blue-light">
      {renderPage()}
      {!showPasswordPage && (
        <Navigation activeTab={activeTab} onTabChange={handleTabChange} isParentMode={isParentMode} />
      )}
    </div>
  )
}

export default App
