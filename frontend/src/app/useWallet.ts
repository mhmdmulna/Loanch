import { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserProvider } from 'ethers'
import { botChainConfig } from '../contracts/config'
import { getWalletProvider, subscribeWalletProvider, type InjectedProvider } from '../contracts/walletProvider'

export type WalletState = 'disconnected' | 'connecting' | 'connected' | 'rejected' | 'wrong-network'

const configuredChainId = botChainConfig.chainId
const validChainId = /^\d+$/.test(configuredChainId) && BigInt(configuredChainId) > 0n
export const expectedChainId = validChainId ? BigInt(configuredChainId) : null

export function shortAddress(address: string) {
  return address.length > 12 ? `${address.slice(0, 6)}…${address.slice(-4)}` : address
}

export function useWallet() {
  const [initialLoading, setInitialLoading] = useState(true)
  const [status, setStatus] = useState<WalletState>('disconnected')
  const [address, setAddress] = useState('')
  const [chainId, setChainId] = useState<bigint | null>(null)
  const [error, setError] = useState('')
  const [hasMetaMask, setHasMetaMask] = useState(false)
  const requestId = useRef(0)
  const mounted = useRef(false)
  const providerRef = useRef<InjectedProvider | null>(null)

  const inspect = useCallback(async (knownAccounts?: string[], providerOverride?: InjectedProvider | null) => {
    const id = ++requestId.current
    const injected = providerOverride || providerRef.current || getWalletProvider()
    providerRef.current = injected
    setHasMetaMask(Boolean(injected))
    if (!injected) {
      if (mounted.current) {
        setStatus('disconnected')
        setAddress('')
        setChainId(null)
        setInitialLoading(false)
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
    } finally {
      if (id === requestId.current && mounted.current) {
        setInitialLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    let injected: InjectedProvider | null = null

    const handleAccountsChanged = (value: unknown) => {
      void inspect(Array.isArray(value) ? value as string[] : [], injected)
    }
    const handleChainChanged = () => {
      void inspect(undefined, injected)
    }

    const useProvider = (provider: InjectedProvider | null) => {
      if (provider === injected) return
      injected?.removeListener?.('accountsChanged', handleAccountsChanged)
      injected?.removeListener?.('chainChanged', handleChainChanged)
      injected = provider
      providerRef.current = provider
      provider?.on?.('accountsChanged', handleAccountsChanged)
      provider?.on?.('chainChanged', handleChainChanged)
      void inspect(undefined, provider)
    }

    const unsubscribe = subscribeWalletProvider(useProvider)
    return () => {
      mounted.current = false
      unsubscribe()
      injected?.removeListener?.('accountsChanged', handleAccountsChanged)
      injected?.removeListener?.('chainChanged', handleChainChanged)
    }
  }, [inspect])

  const connect = useCallback(async () => {
    const injected = providerRef.current || getWalletProvider()
    if (!injected) {
      setStatus('disconnected')
      setError('MetaMask is not installed in this browser.')
      return
    }
    setStatus('connecting')
    setError('')
    try {
      const accounts = await injected.request({ method: 'eth_requestAccounts' }) as string[]
      await inspect(accounts, injected)
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
    const injected = providerRef.current || getWalletProvider()
    if (!injected || expectedChainId === null) return
    setStatus('connecting')
    setError('')
    try {
      await injected.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${expectedChainId.toString(16)}` }],
      })
      await inspect(undefined, injected)
    } catch (cause) {
      if (!mounted.current) return
      const code = (cause as { code?: number }).code
      if (code === 4902) {
        try {
          await injected.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${expectedChainId.toString(16)}`,
              chainName: botChainConfig.chainName,
              nativeCurrency: botChainConfig.nativeCurrency,
              rpcUrls: [botChainConfig.rpcUrl],
              blockExplorerUrls: [botChainConfig.explorerUrl],
            }],
          })
          await inspect(undefined, injected)
          return
        } catch (addCause) {
          const addCode = (addCause as { code?: number }).code
          setStatus('wrong-network')
          setError(addCode === 4001 ? 'Adding BOT Chain was rejected in MetaMask.' : 'Could not add BOT Chain to MetaMask.')
          return
        }
      }
      setStatus('wrong-network')
      setError(code === 4001
          ? 'Network switch rejected in MetaMask.'
          : 'Could not switch networks. Check MetaMask and try again.')
    }
  }, [inspect])

  return { initialLoading, status, address, chainId, error, connect, switchNetwork, hasMetaMask }
}

