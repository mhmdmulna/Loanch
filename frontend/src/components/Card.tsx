import type { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  highlighted?: boolean
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({
  children,
  highlighted = false,
  className,
  ...props
}: CardProps) {
  const baseStyles =
    'loanch-panel overflow-hidden'
  const borderStyles = highlighted ? 'border-[var(--loanch-accent)] border-2' : ''

  const combinedClassName = [baseStyles, borderStyles, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({
  children,
  className,
  ...props
}: CardHeaderProps) {
  const baseStyles = 'px-5 py-4 border-b border-[var(--loanch-border)]'
  const combinedClassName = [baseStyles, className].filter(Boolean).join(' ')

  return (
    <div className={combinedClassName} {...props}>
      <h3 className="text-lg font-semibold tracking-[-0.02em] text-slate-50">{children}</h3>
    </div>
  )
}

export function CardContent({
  children,
  className,
  ...props
}: CardContentProps) {
  const baseStyles = 'px-5 py-5'
  const combinedClassName = [baseStyles, className].filter(Boolean).join(' ')

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({
  children,
  className,
  ...props
}: CardFooterProps) {
  const baseStyles =
    'px-5 py-4 bg-[var(--loanch-surface-inset)] border-t border-[var(--loanch-border)] flex justify-between items-center'
  const combinedClassName = [baseStyles, className].filter(Boolean).join(' ')

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  )
}
