interface SpinnerProps {
  size?: 'small' | 'medium' | 'large'
  color?: 'emerald' | 'slate'
  label?: string
}

const sizeClasses = {
  small: 'h-4 w-4',
  medium: 'h-6 w-6',
  large: 'h-8 w-8',
}

const colorClasses = {
  emerald: 'text-emerald-500',
  slate: 'text-slate-400',
}

export function Spinner({
  size = 'medium',
  color = 'emerald',
  label,
}: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <svg
        className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {label && <p className="text-sm text-slate-400">{label}</p>}
    </div>
  )
}

// Skeleton loading component
interface SkeletonProps {
  className?: string
  count?: number
}

export function Skeleton({ className = 'h-4 w-24', count = 1 }: SkeletonProps) {
  const skeletons = Array.from({ length: count })

  return (
    <div className="space-y-2">
      {skeletons.map((_, idx) => (
        <div
          key={idx}
          className={`${className} bg-slate-700 rounded-md animate-pulse`}
        />
      ))}
    </div>
  )
}

// Progress bar component
interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className="space-y-2">
      {(label || showPercentage) && (
        <div className="flex justify-between text-xs">
          {label && <span className="text-slate-300">{label}</span>}
          {showPercentage && (
            <span className="text-slate-400">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
