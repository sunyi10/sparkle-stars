import { useState } from 'react'
import { Lock, ArrowLeft, AlertCircle } from 'lucide-react'
import { useModeStore } from '@/store'

interface PasswordPageProps {
  onSuccess: () => void
  onCancel: () => void
}

const DEFAULT_PASSWORD = '147258'

export function PasswordPage({ onSuccess, onCancel }: PasswordPageProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { switchToParentMode } = useModeStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password === DEFAULT_PASSWORD) {
      switchToParentMode()
      onSuccess()
    } else {
      setError('密码错误，请重试')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <button
        onClick={onCancel}
        className="absolute top-4 left-4 flex items-center gap-2 text-pink-400 hover:text-pink-500 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>返回</span>
      </button>

      <div className="card w-full max-w-sm text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center">
          <Lock className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-xl font-bold text-gray-800 mb-2">家长模式</h2>
        <p className="text-gray-500 text-sm mb-6">请输入密码以进入家长管理模式</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="请输入密码"
              className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:outline-none text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-pink-300 text-white rounded-xl font-bold hover:bg-pink-400 transition-colors"
          >
            确认
          </button>
        </form>


      </div>
    </div>
  )
}
