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

const TARGET_CHAIN_ID = botChainConfig.chainId ? parseInt(botChainConfig.chainId) : 1

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
        isCorrectNetwork: chainId === TARGET_CHAIN_ID,
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
        error: "No compatible wallet was found. Install a browser wallet such as MetaMask, then try again.",
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
        error: error instanceof Error && error.message.toLowerCase().includes("reject")
          ? "The wallet connection was cancelled. Connect your wallet to continue."
          : "Loanch could not connect to your wallet. Check that it is unlocked and try again.",
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
    if (!window.ethereum || !botChainConfig.chainId) {
      setState(prev => ({
        ...prev,
        error: "BOT Chain is not configured for this demo, so the network cannot be switched yet.",
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
            error: "BOT Chain could not be added to your wallet. Check the network settings and try again.",
          }))
        }
      } else {
        console.error("Error switching network:", error)
        setState(prev => ({
          ...prev,
          error: "The wallet stayed on the wrong network. Switch to BOT Chain in your wallet and try again.",
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
