import { useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import { botChainConfig } from "../contracts/config"

export interface WalletState {
  isConnected: boolean
  address: string | null
  chainId: number | null
  balance: string | null
  isCorrectNetwork: boolean
  isLoading: boolean
  error: string | null
}

export interface WalletActions {
  connect: () => Promise<void>
  disconnect: () => void
  switchNetwork: () => Promise<void>
  refreshBalance: () => Promise<void>
}

const configuredChainId = botChainConfig.chainId?.trim()
const parsedChainId = configuredChainId ? Number(configuredChainId) : Number.NaN
const TARGET_CHAIN_ID = Number.isSafeInteger(parsedChainId) && parsedChainId > 0
  ? parsedChainId
  : null

declare global {
  interface Window {
    ethereum?: any
  }
}

export function useWallet(): [WalletState, WalletActions] {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    balance: null,
    isCorrectNetwork: false,
    isLoading: false,
    error: null,
  })

  const updateWalletState = useCallback(async () => {
    if (!window.ethereum) return

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.listAccounts()
      
      if (accounts.length === 0) {
        setState(prev => ({
          ...prev,
          isConnected: false,
          address: null,
          chainId: null,
          balance: null,
          isCorrectNetwork: false,
        }))
        return
      }

      const network = await provider.getNetwork()
      const chainId = Number(network.chainId)
      const address = accounts[0].address
      const balance = await provider.getBalance(address)

      setState(prev => ({
        ...prev,
        isConnected: true,
        address,
        chainId,
        balance: ethers.formatEther(balance),
        isCorrectNetwork: TARGET_CHAIN_ID !== null && chainId === TARGET_CHAIN_ID,
        error: null,
      }))
    } catch (error) {
      console.error("Error updating wallet state:", error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Unknown wallet error",
      }))
    }
  }, [])

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setState(prev => ({
        ...prev,
        error: "MetaMask not installed",
      }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      await updateWalletState()
    } catch (error) {
      console.error("Error connecting wallet:", error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to connect wallet",
      }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [updateWalletState])

  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      address: null,
      chainId: null,
      balance: null,
      isCorrectNetwork: false,
      isLoading: false,
      error: null,
    })
  }, [])

  const switchNetwork = useCallback(async () => {
    if (!window.ethereum || TARGET_CHAIN_ID === null) {
      setState(prev => ({
        ...prev,
        error: "Cannot switch network: MetaMask not available or BOT Chain chain ID is invalid or not configured",
      }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${TARGET_CHAIN_ID.toString(16)}` }],
      })
      await updateWalletState()
    } catch (error: any) {
      if (error.code === 4902 && botChainConfig.rpcUrl) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: `0x${TARGET_CHAIN_ID.toString(16)}`,
              chainName: "BOT Chain",
              rpcUrls: [botChainConfig.rpcUrl],
              nativeCurrency: {
                name: "BOT",
                symbol: "BOT",
                decimals: 18,
              },
            }],
          })
          await updateWalletState()
        } catch (addError) {
          console.error("Error adding BOT Chain:", addError)
          setState(prev => ({
            ...prev,
            error: "Failed to add BOT Chain to wallet",
          }))
        }
      } else {
        console.error("Error switching network:", error)
        setState(prev => ({
          ...prev,
          error: "Failed to switch to BOT Chain",
        }))
      }
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [updateWalletState])

  const refreshBalance = useCallback(async () => {
    if (!state.isConnected || !window.ethereum || !state.address) return

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const balance = await provider.getBalance(state.address)
      setState(prev => ({
        ...prev,
        balance: ethers.formatEther(balance),
      }))
    } catch (error) {
      console.error("Error refreshing balance:", error)
    }
  }, [state.isConnected, state.address])

  useEffect(() => {
    if (!window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect()
      } else {
        updateWalletState()
      }
    }

    const handleChainChanged = () => {
      updateWalletState()
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)
    updateWalletState()

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [updateWalletState, disconnect])

  return [
    state,
    {
      connect,
      disconnect,
      switchNetwork,
      refreshBalance,
    },
  ]
}
