import { Badge, CheckIcon, ExclamationIcon, XIcon } from './Badge'
import type { TransactionState } from '../types'

interface TransactionStatusProps {
  state: TransactionState
  message?: string
  txHash?: string
  error?: string
}

const statusConfig: Record<
  TransactionState,
  { badge: string; variant: 'success' | 'warning' | 'error' | 'neutral' | 'pending'; icon?: React.ReactNode }
> = {
  ready: {
    badge: 'Ready',
    variant: 'neutral',
  },
  preparing: {
    badge: 'Preparing...',
    variant: 'pending',
  },
  'waiting-wallet': {
    badge: 'Awaiting wallet...',
    variant: 'pending',
  },
  submitted: {
    badge: 'Submitted',
    variant: 'pending',
  },
  confirming: {
    badge: 'Confirming...',
    variant: 'pending',
  },
  confirmed: {
    badge: 'Confirmed',
    variant: 'success',
    icon: <CheckIcon />,
  },
  failed: {
    badge: 'Failed',
    variant: 'error',
    icon: <ExclamationIcon />,
  },
  rejected: {
    badge: 'Rejected',
    variant: 'error',
    icon: <XIcon />,
  },
}

export function TransactionStatus({
  state,
  message,
  txHash,
  error,
}: TransactionStatusProps) {
  const config = statusConfig[state]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Badge variant={config.variant} animated={state === 'confirming'}>
          {config.badge}
        </Badge>
        {txHash && (
          <a
            href={`#`}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            title={txHash}
          >
            View on explorer
          </a>
        )}
      </div>

      {message && (
        <p className="text-sm text-slate-300">{message}</p>
      )}

      {error && (
        <div className="rounded-lg bg-rose-500 bg-opacity-10 border border-rose-500 px-4 py-3">
          <p className="text-xs text-rose-200">{error}</p>
        </div>
      )}

      {txHash && (
        <div className="rounded-lg bg-slate-700 px-4 py-2">
          <p className="text-xs text-slate-400 break-all font-mono">{txHash}</p>
        </div>
      )}
    </div>
  )
}

export function TransactionIndicator({
  state,
}: {
  state: TransactionState
}) {
  const config = statusConfig[state]
  const isConfirming = state === 'confirming'

  return (
    <div className="inline-flex items-center gap-2">
      {isConfirming && (
        <svg
          className="h-4 w-4 animate-spin text-amber-400"
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
      )}
      <Badge variant={config.variant} icon={config.icon} animated={isConfirming}>
        {config.badge}
      </Badge>
    </div>
  )
}
