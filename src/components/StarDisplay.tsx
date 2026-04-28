import { Star } from 'lucide-react'

interface StarDisplayProps {
  count: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
}

export function StarDisplay({ count, size = 'md', showNumber = true }: StarDisplayProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex items-center gap-1">
      <Star className={`${sizeClasses[size]} text-gold-100 drop-shadow-md fill-gold-100`} />
      {showNumber && (
        <span className={`font-bold text-gold-100 ${size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-xl' : 'text-sm'}`}>
          {count}
        </span>
      )}
    </div>
  )
}
