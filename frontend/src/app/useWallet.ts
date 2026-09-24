import { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserProvider } from 'ethers'

export type WalletState = 'disconnected' | 'connecting' | 'connected' | 'rejected' | 'wrong-network'

type InjectedProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
  on?: (event: 'accountsChanged' | 'chainChanged', handler: (...args: unknown[]) => void) => void
  removeListener?: (event: 'accountsChanged' | 'chainChanged', handler: (...args: unknown[]) => void) => void
}

declare global {
  interface Window {
    ethereum?: InjectedProvider
  }
}

const configuredChainId = import.meta.env.VITE_BOT_CHAIN_CHAIN_ID?.trim() || ''
const validChainId = /^\d+$/.test(configuredChainId) && BigInt(configuredChainId) > 0n
export const expectedChainId = validChainId ? BigInt(configuredChainId) : null

export function shortAddress(address: string) {
  return address.length > 12 ? `${address.slice(0, 6)}…${address.slice(-4)}` : address
}

export function useWallet() {
  const [status, setStatus] = useState<WalletState>('disconnected')
  const [address, setAddress] = useState('')
  const [chainId, setChainId] = useState<bigint | null>(null)
  const [error, setError] = useState('')
  const requestId = useRef(0)
  const mounted = useRef(false)

  const inspect = useCallback(async (knownAccounts?: string[]) => {
    const id = ++requestId.current
    const injected = window.ethereum
    if (!injected) {
      if (mounted.current) {
        setStatus('disconnected')
        setAddress('')
        setChainId(null)
      }
      return
    }

    try {
      const provider = new BrowserProvider(injected)
      const accounts = knownAccounts ?? await provider.send('eth_accounts', []) as string[]
      if (id !== requestId.current || !mounted.current) return
      if (!accounts.length) {
        setStatus('disconnected')
        setAddress('')
        setChainId(null)
        setError('')
        return
      }

      const network = await provider.getNetwork()
      if (id !== requestId.current || !mounted.current) return
      setAddress(accounts[0])
      setChainId(network.chainId)
      if (expectedChainId === null) {
        setStatus('wrong-network')
        setError('BOT Chain ID is not configured for this app.')
      } else if (network.chainId !== expectedChainId) {
        setStatus('wrong-network')
        setError(`Switch to BOT Chain (chain ID ${expectedChainId}) to continue.`)
      } else {
        setStatus('connected')
        setError('')
      }
    } catch {
      if (id !== requestId.current || !mounted.current) return
      setStatus('disconnected')
      setAddress('')
      setChainId(null)
      setError('Could not read MetaMask connection. Try again.')
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    void Promise.resolve().then(() => inspect())
    const injected = window.ethereum

    const handleAccountsChanged = (value: unknown) => {
      void inspect(Array.isArray(value) ? value as string[] : [])
    }
    const handleChainChanged = () => {
      void inspect()
    }

    injected?.on?.('accountsChanged', handleAccountsChanged)
    injected?.on?.('chainChanged', handleChainChanged)
    return () => {
      mounted.current = false
      injected?.removeListener?.('accountsChanged', handleAccountsChanged)
      injected?.removeListener?.('chainChanged', handleChainChanged)
    }
  }, [inspect])

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setStatus('disconnected')
      setError('MetaMask is not installed in this browser.')
      return
    }
    setStatus('connecting')
    setError('')
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[]
      await inspect(accounts)
    } catch (cause) {
      const code = (cause as { code?: number }).code
      if (!mounted.current) return
      setStatus('rejected')
      setAddress('')
      setChainId(null)
      setError(code === 4001 ? 'Connection request rejected in MetaMask.' : 'Could not connect MetaMask. Try again.')
    }
  }, [inspect])

  const switchNetwork = useCallback(async () => {
    if (!window.ethereum || expectedChainId === null) return
    setStatus('connecting')
    setError('')
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${expectedChainId.toString(16)}` }],
      })
      await inspect()
    } catch (cause) {
      if (!mounted.current) return
      const code = (cause as { code?: number }).code
      setStatus('wrong-network')
      setError(code === 4902
        ? 'BOT Chain is not added to MetaMask. Add it manually with the project network details.'
        : code === 4001
          ? 'Network switch rejected in MetaMask.'
          : 'Could not switch networks. Check MetaMask and try again.')
    }
  }, [inspect])

  return { status, address, chainId, error, connect, switchNetwork, hasMetaMask: Boolean(window.ethereum) }
}

