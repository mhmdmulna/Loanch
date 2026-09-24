import { useState } from "react"
import { Card, CardContent, CardHeader } from "../components/Card"
import { Button } from "../components/Button"
import { Badge, CheckIcon, ExclamationIcon } from "../components/Badge"
import { useWallet } from "../hooks/useWallet"
import { LOANCH_CONTRACT_ADDRESS } from "../contracts/addresses"
import { botChainConfig } from "../contracts/config"
import { BOT_CHAIN_INFO } from "../data/mockData"
import type { Page } from "../types"

interface BlockchainPageProps {
  onNavigate: (page: Page) => void
}

export function BlockchainPage({ onNavigate }: BlockchainPageProps) {
  const [wallet, walletActions] = useWallet()
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false)
  const [copied, setCopied] = useState(false)

  const isContractConfigured = Boolean(LOANCH_CONTRACT_ADDRESS && LOANCH_CONTRACT_ADDRESS.trim().length > 0)
  const contractAddressDisplay = isContractConfigured
    ? LOANCH_CONTRACT_ADDRESS
    : "Not Configured (Integration Pending)"

  const currentChainId = wallet.chainId || (botChainConfig.chainId ? parseInt(botChainConfig.chainId) : null)
  const isBOTChain = currentChainId === BOT_CHAIN_INFO.testnetChainId || currentChainId === BOT_CHAIN_INFO.mainnetChainId

  const handleCopyAddress = () => {
    if (LOANCH_CONTRACT_ADDRESS) {
      navigator.clipboard.writeText(LOANCH_CONTRACT_ADDRESS)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="loanch-page loanch-secondary py-8">
      <div className="loanch-container space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-slate-100">Blockchain Transparency</h1>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                Phase 11
              </span>
            </div>
            <p className="text-slate-400 mt-1">
              Verify smart contract addresses, network configurations, and programmatic financial invariants.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="small" onClick={() => onNavigate("pool")}>
              Pool Transparency
            </Button>
            <Button variant="secondary" size="small" onClick={() => onNavigate("dashboard")}>
              Dashboard
            </Button>
          </div>
        </div>

        {/* Human-Readable First Principle Banner */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100">
                Design Principle: Human-Readable Result First, Technical Blockchain Data Second
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Every transaction result is explained in plain financial language before exposing cryptographic hashes.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="text-xs font-medium text-blue-400 hover:text-blue-300 underline"
          >
            {showTechnicalDetails ? "Hide Technical Invariants" : "Show Technical Invariants"}
          </button>
        </div>

        {/* Network & Contract Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Network Information */}
          <Card className="border-slate-800">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-100">BOT Chain Network</h2>
                <Badge variant={isBOTChain ? "success" : "neutral"}>
                  {isBOTChain ? "BOT Chain Active" : "Network Check"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Target Ecosystem</span>
                  <span className="text-slate-100 font-semibold">BOT Chain</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">BOT Testnet Chain ID</span>
                  <span className="font-mono text-emerald-400 font-semibold">{BOT_CHAIN_INFO.testnetChainId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">BOT Mainnet Chain ID</span>
                  <span className="font-mono text-blue-400 font-semibold">{BOT_CHAIN_INFO.mainnetChainId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Native Token Symbol</span>
                  <span className="text-slate-100 font-medium">BOT (18 decimals)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Current Connected Chain ID</span>
                  <span className="font-mono text-slate-200">
                    {wallet.chainId ? `${wallet.chainId}` : "Not connected"}
                  </span>
                </div>
              </div>

              {!wallet.isConnected ? (
                <div className="pt-2">
                  <Button fullWidth size="small" onClick={walletActions.connect}>
                    Connect Wallet to Inspect Chain
                  </Button>
                </div>
              ) : !wallet.isCorrectNetwork ? (
                <div className="pt-2 space-y-2">
                  <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-200 flex gap-2">
                    <ExclamationIcon />
                    <span>Your wallet is connected to a different network.</span>
                  </div>
                  <Button fullWidth size="small" variant="secondary" onClick={walletActions.switchNetwork}>
                    Switch to BOT Chain ({BOT_CHAIN_INFO.testnetChainId})
                  </Button>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300 flex items-center gap-2">
                  <CheckIcon />
                  <span>Wallet is properly synchronized to BOT Chain.</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Smart Contract Configuration State */}
          <Card className="border-slate-800">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-100">Smart Contract Configuration</h2>
                <Badge variant={isContractConfigured ? "success" : "warning"}>
                  {isContractConfigured ? "Address Configured" : "Configuration Pending"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Loanch Core Contract Address:</span>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-slate-200 flex items-center justify-between break-all">
                  <span>{contractAddressDisplay}</span>
                  {isContractConfigured && (
                    <button
                      onClick={handleCopyAddress}
                      className="ml-2 text-emerald-400 hover:text-emerald-300 text-xs flex-shrink-0"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  )}
                </div>
              </div>

              {/* Clear configuration / unavailable state */}
              {!isContractConfigured ? (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-slate-400 leading-relaxed">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5 text-xs">
                    <ExclamationIcon /> Contract Address Unavailable in Local Environment
                  </div>
                  <p>
                    No contract address has been supplied via <code className="text-emerald-400">VITE_LOANCH_CONTRACT_ADDRESS</code>. 
                    The application is currently operating in isolated demonstration mode.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    To connect to live on-chain state, deploy the smart contracts to BOT Chain and set the address in your frontend <code className="text-slate-400">.env</code> configuration file.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200">
                  <div className="font-semibold flex items-center gap-1.5">
                    <CheckIcon /> Contract Configured
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Frontend reads state deterministically from this deployed address on BOT Chain.
                  </p>
                </div>
              )}

              {/* Block Explorer Status */}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-slate-400">
                <span>BOT Chain Explorer:</span>
                {isContractConfigured ? (
                  <span className="text-blue-400 cursor-pointer hover:underline">
                    View Contract on Explorer ↗
                  </span>
                ) : (
                  <span className="text-slate-500 italic">
                    Explorer link unavailable (awaiting deployment)
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Verification Policy Card */}
        <Card className="border-slate-800">
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-100">Transaction Verification & Hash Policy</h2>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="font-semibold text-slate-100 flex items-center gap-2">
                <CheckIcon /> Authenticity Policy: No Fake Hashes
              </div>
              <p className="text-slate-400">
                Loanch strictly adheres to transparent cryptographic standards: <strong>we never generate fake mock transaction hashes to simulate confirmed production transactions.</strong>
              </p>
              <p className="text-slate-400">
                During demonstration and local testing, transaction flows display simulated progress states with an explicit "Demo / Simulation Mode" badge. Real transaction hashes and block confirmations will only be rendered once a real transaction is mined on BOT Chain.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Progressive Disclosure: Technical Invariants & Verification Section */}
        {showTechnicalDetails && (
          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">
                    Smart Contract Financial Invariants
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Mathematical properties verified and guaranteed by Solidity contracts on BOT Chain
                  </p>
                </div>
                <Badge variant="success">Immutable Rules</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Invariant 1 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-semibold text-emerald-400 text-sm">
                    1. Solvency Conservation Invariant
                  </div>
                  <div className="p-2 rounded bg-slate-900 font-mono text-[11px] text-slate-200">
                    TotalDeposits = ActiveLoans + AvailableLiquidity
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    At any block height, every unit of Saver deposit must be accounted for either as an active borrower obligation or as liquid pool reserve.
                  </p>
                </div>

                {/* Invariant 2 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-semibold text-blue-400 text-sm">
                    2. Mandatory Liquidity Reserve Floor
                  </div>
                  <div className="p-2 rounded bg-slate-900 font-mono text-[11px] text-slate-200">
                    LiquidityReserve &gt;= TotalDeposits × 20%
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Smart contract loan disbursement functions strictly revert if a new loan would cause total active lending to exceed 80% of pool deposits.
                  </p>
                </div>

                {/* Invariant 3 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-semibold text-amber-400 text-sm">
                    3. Skin-in-the-Game Collateral Invariant
                  </div>
                  <div className="p-2 rounded bg-slate-900 font-mono text-[11px] text-slate-200">
                    LockedStake &gt;= Principal × MinStakePercentage
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Collateral is locked before loan disbursement. The smart contract releases stake only when remaining debt equals zero.
                  </p>
                </div>

                {/* Invariant 4 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-semibold text-purple-400 text-sm">
                    4. Deterministic Distribution Formula
                  </div>
                  <div className="p-2 rounded bg-slate-900 font-mono text-[11px] text-slate-200">
                    MarginRepaid = 80% Savers + 15% Platform + 5% LossReserve
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Borrower repayments amortize principal first. Once principal is cleared, gross margin is split pro-rata to active Savers and reserve buffers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
