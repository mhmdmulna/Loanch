import type { InputHTMLAttributes, ReactNode } from 'react'
import type { InputType } from '../types'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  type?: InputType
  error?: string
  success?: string
  icon?: ReactNode
  required?: boolean
}

export function Input({
  label,
  type = 'text',
  error,
  success,
  icon,
  required = false,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  const baseInputStyles =
    'w-full px-3 py-2 bg-slate-950 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-all'

  const errorStyles = error
    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
    : ''
  const successStyles = success
    ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500'
    : ''

  const inputClassName = [baseInputStyles, errorStyles, successStyles, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-xs font-medium text-slate-100"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          type={type}
          className={inputClassName}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : success ? `${inputId}-success` : undefined}
          {...props}
        />
        {icon && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
            {icon}
          </div>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} role="alert" className="mt-1 text-xs text-rose-400 flex items-center gap-1">
          <svg
            className="h-3 w-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 5.313 10.899a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l8.788-8.788z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {success && (
        <p id={`${inputId}-success`} role="status" className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
          <svg
            className="h-3 w-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          {success}
        </p>
      )}
    </div>
  )
}

interface TextAreaProps
  extends Omit<InputHTMLAttributes<HTMLTextAreaElement>, 'type'> {
  label?: string
  error?: string
  success?: string
  required?: boolean
}

export function TextArea({
  label,
  error,
  success,
  required = false,
  className,
  id,
  ...props
}: TextAreaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

  const baseStyles =
    'w-full px-3 py-2 bg-slate-950 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-all resize-none min-h-24'

  const errorStyles = error
    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
    : ''
  const successStyles = success
    ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500'
    : ''

  const textareaClassName = [baseStyles, errorStyles, successStyles, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-2 block text-xs font-medium text-slate-100"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        id={textareaId}
        className={textareaClassName}
        required={required}
        {...props}
      />

      {error && (
        <p className="mt-1 text-xs text-rose-400">{error}</p>
      )}

      {success && (
        <p className="mt-1 text-xs text-emerald-400">{success}</p>
      )}
    </div>
  )
}
