import type { ReactNode } from "react"
import { Button } from "./Button"
import { Badge, ExclamationIcon } from "./Badge"
import { useWallet } from "../hooks/useWallet"

interface WalletButtonProps {
  variant?: "primary" | "secondary"
  size?: "small" | "medium" | "large"
  showBalance?: boolean
  children?: ReactNode
}

export function WalletButton({
  variant = "primary",
  size = "medium",
  showBalance = false,
  children,
}: WalletButtonProps) {
  const [wallet, walletActions] = useWallet()

  if (!wallet.isConnected) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={walletActions.connect}
        isLoading={wallet.isLoading}
      >
        {children || "Connect Wallet"}
      </Button>
    )
  }

  if (!wallet.isCorrectNetwork) {
    return (
      <Button
        variant="secondary"
        size={size}
        onClick={walletActions.switchNetwork}
        isLoading={wallet.isLoading}
      >
        Switch to BOT Chain
      </Button>
    )
  }

  const displayAddress = wallet.address
    ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
    : ""

  return (
    <div className="flex items-center gap-3">
      {showBalance && wallet.balance && (
        <div className="text-sm text-slate-300">
          {parseFloat(wallet.balance).toFixed(4)} BOT
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className="text-sm text-slate-100">{displayAddress}</div>
        <Button variant="secondary" size="small" onClick={walletActions.disconnect}>
          Disconnect
        </Button>
      </div>
    </div>
  )
}

interface WalletStatusProps {
  showDetails?: boolean
}

export function WalletStatus({ showDetails = false }: WalletStatusProps) {
  const [wallet] = useWallet()

  if (wallet.error) {
    return (
      <div className="rounded-lg bg-rose-500 bg-opacity-10 border border-rose-500 p-4">
        <div className="flex items-center gap-2 text-rose-200 text-sm">
          <ExclamationIcon />
          {wallet.error}
        </div>
      </div>
    )
  }

  if (!wallet.isConnected) {
    return (
      <Badge variant="neutral">
        Wallet not connected
      </Badge>
    )
  }

  if (!wallet.isCorrectNetwork) {
    return (
      <Badge variant="warning" icon={<ExclamationIcon />}>
        Wrong network
      </Badge>
    )
  }

  const networkBadge = (
    <Badge variant="success">
      BOT Chain
    </Badge>
  )

  if (!showDetails) {
    return networkBadge
  }

  return (
    <div className="space-y-2">
      {networkBadge}
      <div className="text-sm text-slate-400">
        <div>Address: {wallet.address}</div>
        {wallet.balance && (
          <div>Balance: {parseFloat(wallet.balance).toFixed(4)} BOT</div>
        )}
        {wallet.chainId && (
          <div>Chain ID: {wallet.chainId}</div>
        )}
      </div>
    </div>
  )
}

interface NetworkGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export function NetworkGuard({ children, fallback }: NetworkGuardProps) {
  const [wallet, walletActions] = useWallet()

  if (!wallet.isConnected) {
    return (
      <div className="text-center p-8">
        <p className="text-slate-400 mb-4">Connect your wallet to continue</p>
        <Button onClick={walletActions.connect} isLoading={wallet.isLoading}>
          Connect Wallet
        </Button>
      </div>
    )
  }

  if (!wallet.isCorrectNetwork) {
    return (
      fallback || (
        <div className="text-center p-8">
          <p className="text-slate-400 mb-4">Switch to BOT Chain to continue</p>
          <Button
            onClick={walletActions.switchNetwork}
            isLoading={wallet.isLoading}
            variant="secondary"
          >
            Switch Network
          </Button>
        </div>
      )
    )
  }

  if (wallet.error) {
    return (
      <div className="text-center p-8">
        <div className="rounded-lg bg-rose-500 bg-opacity-10 border border-rose-500 p-4 mb-4">
          <div className="flex items-center justify-center gap-2 text-rose-200 text-sm">
            <ExclamationIcon />
            {wallet.error}
          </div>
        </div>
        <Button onClick={walletActions.connect}>
          Try Again
        </Button>
      </div>
    )
  }

  return <>{children}</>
}
