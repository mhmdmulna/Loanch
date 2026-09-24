import type { ReactNode, ButtonHTMLAttributes } from 'react'
import type { ButtonVariant, ButtonSize } from '../types'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  children: ReactNode
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white',
  secondary: 'bg-slate-800 border border-slate-600 hover:bg-slate-700 text-slate-100',
  danger: 'bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white',
}

const sizeStyles: Record<ButtonSize, string> = {
  small: 'px-2 py-1 text-sm',
  medium: 'px-3 py-2 text-base',
  large: 'px-4 py-3 text-base',
}

const heightStyles: Record<ButtonSize, string> = {
  small: 'h-8',
  medium: 'h-10',
  large: 'h-12',
}

export function Button({
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-semibold rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-normal'

  const variantClass = variantStyles[variant]
  const sizeClass = sizeStyles[size]
  const heightClass = heightStyles[size]
  const widthClass = fullWidth ? 'w-full' : ''

  const disabledVariant =
    variant === 'danger' || variant === 'secondary'
      ? 'disabled:bg-slate-700 disabled:border-slate-600'
      : ''

  const combinedClassName = [
    baseStyles,
    variantClass,
    sizeClass,
    heightClass,
    widthClass,
    disabledVariant,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={props.type ?? 'button'}
      className={combinedClassName}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="h-4 w-4 animate-spin"
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
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  )
}
