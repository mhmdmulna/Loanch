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
  primary: 'bg-[var(--loanch-accent)] hover:bg-[var(--loanch-accent-strong)] active:bg-[var(--loanch-accent-strong)] text-[var(--loanch-bg)]',
  secondary: 'bg-transparent border border-[var(--loanch-border-strong)] hover:bg-[var(--loanch-surface-raised)] text-slate-100',
  danger: 'bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white',
}

const sizeStyles: Record<ButtonSize, string> = {
  small: 'px-3 py-1.5 text-xs',
  medium: 'px-4 py-2.5 text-sm',
  large: 'px-5 py-3 text-sm',
}

const heightStyles: Record<ButtonSize, string> = {
  small: 'min-h-8',
  medium: 'min-h-10',
  large: 'min-h-12',
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
    'font-semibold rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--loanch-accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-normal tracking-[0.01em]'

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
      className={combinedClassName}
      disabled={disabled || isLoading}
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
