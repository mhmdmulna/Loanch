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
    'bg-slate-800 border rounded-xl shadow-lg overflow-hidden'
  const borderStyles = highlighted ? 'border-emerald-500 border-2' : 'border-slate-700'

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
  const baseStyles = 'px-6 py-4 border-b border-slate-700'
  const combinedClassName = [baseStyles, className].filter(Boolean).join(' ')

  return (
    <div className={combinedClassName} {...props}>
      <h3 className="text-2xl font-bold text-slate-50">{children}</h3>
    </div>
  )
}

export function CardContent({
  children,
  className,
  ...props
}: CardContentProps) {
  const baseStyles = 'px-6 py-4'
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
    'px-6 py-4 bg-slate-900 border-t border-slate-700 flex justify-between items-center'
  const combinedClassName = [baseStyles, className].filter(Boolean).join(' ')

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  )
}
