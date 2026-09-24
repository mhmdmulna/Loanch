import { BrowserProvider, Contract, Interface, JsonRpcProvider, formatUnits, isAddress, parseUnits } from 'ethers'
import abi from './LoanchPool.json'
import { LOANCH_CONTRACT_ADDRESS } from './addresses'
import { botChainConfig } from './config'

const tokenAbi = [
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function balanceOf(address) view returns (uint256)',
  'function allowance(address,address) view returns (uint256)',
  'function approve(address,uint256) returns (bool)',
]

export type PoolStats = {
  totalShares: bigint; saverPrincipalClaims: bigint; liquidPoolAssets: bigint
  liquidityReserveTarget: bigint; availableLending: bigint; activeLoanPrincipal: bigint
  activeLoanCount: bigint; saverReturnLiability: bigint; platformRevenue: bigint
  lossReserveAmount: bigint
}
export type SaverPosition = { shares: bigint; weightBps: bigint; principalClaim: bigint; claimableReturn: bigint }
export type BorrowerProfile = { riskScore: bigint; reputation: bigint; blockedAfterDefault: boolean }
export type Loan = {
  id: bigint; borrower: string; principal: bigint; principalOutstanding: bigint
  totalRepayment: bigint; amountPaid: bigint; dueDate: bigint; stakeAmount: bigint; status: bigint
}
export type PoolData = {
  assetAddress: string; assetSymbol: string; decimals: number; walletBalance: bigint
  stats: PoolStats; saver: SaverPosition | null; withdrawable: bigint | null
  verified: boolean | null; borrower: BorrowerProfile | null; freeStake: bigint | null
  allocatedStake: bigint | null; activeLoanId: bigint | null; activeLoan: Loan | null
}
export type ActionKind = 'deposit' | 'withdraw' | 'stake' | 'unstake' | 'request' | 'repay' | 'claim'
export type Action = { kind: ActionKind; amount?: bigint; durationDays?: number; loanId?: bigint }
export type TxStage = 'idle' | 'awaiting-wallet' | 'submitted' | 'confirming' | 'confirmed' | 'failed'
export type TxProgress = { stage: TxStage; label: string; hash?: string }

const address = LOANCH_CONTRACT_ADDRESS?.trim() || ''
const rpcUrl = botChainConfig.rpcUrl?.trim() || ''
const chainId = /^\d+$/.test(botChainConfig.chainId?.trim() || '') ? BigInt(botChainConfig.chainId.trim()) : null
const iface = new Interface(abi)
let readProvider: JsonRpcProvider | null = null

function config() {
  if (!rpcUrl || chainId === null || !isAddress(address)) throw new Error('RPC, chain ID, or pool address is missing or invalid.')
  return { address, chainId }
}

function provider() {
  if (!readProvider) readProvider = new JsonRpcProvider(rpcUrl)
  return readProvider
}

export async function verifyPool() {
  const expected = config()
  const rpc = provider()
  const network = await rpc.getNetwork()
  if (network.chainId !== expected.chainId) throw new Error('The configured RPC is on a different chain.')
  if (await rpc.getCode(expected.address) === '0x') throw new Error('No pool contract exists at the configured address.')
  return new Contract(expected.address, abi, rpc)
}

export async function readPool(account?: string): Promise<PoolData> {
  const pool = await verifyPool()
  const [rawStats, assetAddress] = await Promise.all([pool.getPoolStats(), pool.asset()])
  if (!isAddress(assetAddress) || await provider().getCode(assetAddress) === '0x') throw new Error('The pool asset contract is unavailable.')
  const token = new Contract(assetAddress, tokenAbi, provider())
  const [decimalsRaw, symbol] = await Promise.all([token.decimals(), token.symbol()])
  const decimals = Number(decimalsRaw)
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 36) throw new Error('Unsupported pool asset decimals.')
  const user = account && isAddress(account) ? account : null
  const [walletBalance, saver, withdrawable, verified, borrower, freeStake, allocatedStake, activeLoanId] = user
    ? await Promise.all([
      token.balanceOf(user), pool.getSaverPosition(user), pool.withdrawablePrincipal(user),
      pool.identityVerified(user), pool.getBorrowerProfile(user), pool.freeStake(user),
      pool.allocatedStake(user), pool.activeLoanId(user),
    ])
    : [0n, null, null, null, null, null, null, null]
  const activeLoan = activeLoanId && activeLoanId !== 0n ? await pool.getLoan(activeLoanId) : null
  return {
    assetAddress, assetSymbol: symbol, decimals, walletBalance,
    stats: rawStats as PoolStats, saver: saver as SaverPosition | null,
    withdrawable, verified, borrower: borrower as BorrowerProfile | null,
    freeStake, allocatedStake, activeLoanId, activeLoan: activeLoan as Loan | null,
  }
}

export async function readLoan(id: bigint): Promise<Loan | null> {
  if (id <= 0n) return null
  const pool = await verifyPool()
  const loan = await pool.getLoan(id) as Loan
  return loan.id === 0n ? null : loan
}

export type ActivityItem = { hash: string; block: number; action: string }

export async function readActivity(account: string): Promise<ActivityItem[]> {
  if (!isAddress(account)) return []
  await verifyPool()
  const rpc = provider()
  const latest = await rpc.getBlockNumber()
  const fromBlock = Math.max(0, latest - 5000)
  const logs = await rpc.getLogs({ address, fromBlock, toBlock: latest })
  const recent = logs.slice(-200)
  const hashes = [...new Set(recent.map(log => log.transactionHash))]
  const transactions = await Promise.all(hashes.map(hash => rpc.getTransaction(hash)))
  const owned = new Set(transactions.filter(tx => tx?.from.toLowerCase() === account.toLowerCase()).map(tx => tx!.hash))
  const actions = new Map<string, ActivityItem>()
  for (const log of recent) {
    if (!owned.has(log.transactionHash)) continue
    let decoded
    try { decoded = iface.parseLog(log) } catch { continue }
    if (!decoded) continue
    if (!actions.has(log.transactionHash)) actions.set(log.transactionHash, {
      hash: log.transactionHash, block: log.blockNumber, action: decoded.name,
    })
  }
  return [...actions.values()].slice(-20).reverse()
}

export async function readTransaction(hash: string) {
  if (!/^0x[0-9a-fA-F]{64}$/.test(hash)) throw new Error('Invalid transaction hash.')
  await verifyPool()
  const rpc = provider()
  const [tx, receipt] = await Promise.all([rpc.getTransaction(hash), rpc.getTransactionReceipt(hash)])
  if (!tx || !receipt) return null
  const pool = tx.to?.toLowerCase() === address.toLowerCase() || receipt.contractAddress?.toLowerCase() === address.toLowerCase()
  let action = receipt.contractAddress ? 'Contract deployment' : 'Other transaction'
  if (tx.to?.toLowerCase() === address.toLowerCase()) {
    try { action = iface.parseTransaction({ data: tx.data, value: tx.value })?.name ?? 'Pool transaction' }
    catch { action = 'Pool transaction' }
  }
  return { hash, action, from: tx.from, to: tx.to || '', block: receipt.blockNumber, confirmed: receipt.status === 1, pool }
}

export function amountText(amount: bigint | null | undefined, data: PoolData | null) {
  return amount == null || !data ? 'Unavailable' : `${formatUnits(amount, data.decimals)} ${data.assetSymbol}`
}

export function parseAmount(value: string, data: PoolData) {
  if (!/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(value)) throw new Error('Enter a valid positive amount.')
  let amount: bigint
  try { amount = parseUnits(value, data.decimals) } catch { throw new Error(`Use at most ${data.decimals} decimal places.`) }
  if (amount <= 0n) throw new Error('Enter an amount greater than zero.')
  return amount
}

export function eligibilityText(reason: bigint) {
  return [
    'Eligible', 'Identity not verified', 'Risk score too low', 'Reputation too low',
    'Borrowing blocked after default', 'Amount exceeds the loan limit', 'Duration must be 1–365 days',
    'An active loan already exists', 'Insufficient free stake', 'Insufficient pool liquidity',
  ][Number(reason)] ?? 'Unknown eligibility result'
}

export async function previewLoan(account: string, amount: bigint, durationDays: number) {
  const pool = await verifyPool()
  const [reason, stakeRequired] = await pool.previewLoan(account, amount, BigInt(durationDays) * 86400n)
  return { reason: BigInt(reason), stakeRequired: BigInt(stakeRequired) }
}

function readableError(cause: unknown) {
  const error = cause as { code?: number | string; data?: string; reason?: string; shortMessage?: string; info?: { error?: { data?: string } } }
  if (error.code === 4001 || error.code === 'ACTION_REJECTED') return 'Request rejected in MetaMask.'
  const revertData = error.data || error.info?.error?.data
  if (typeof revertData === 'string') {
    try {
      const decoded = iface.parseError(revertData)
      if (decoded?.name === 'LoanNotEligible') return eligibilityText(BigInt(decoded.args[0]))
      if (decoded) return ({
        IdentityNotVerified: 'Identity is not verified by the pool admin.',
        InsufficientPrincipal: 'Amount exceeds your Saver principal.',
        InsufficientLiquidity: 'The pool does not have enough liquid funds.',
        InsufficientStake: 'You need more free stake.',
        Overpayment: 'Amount exceeds the remaining debt.',
        NothingToClaim: 'There is no return available to claim.',
        UnsupportedTokenTransfer: 'This token transfer is not supported by the pool.',
      } as Record<string, string>)[decoded.name] || `Contract rejected: ${decoded.name}.`
    } catch { /* The wallet may omit or wrap revert data. */ }
  }
  return error.shortMessage || error.reason || 'Transaction failed. Check MetaMask and try again.'
}

export async function submitAction(action: Action, account: string, data: PoolData, onProgress: (value: TxProgress) => void) {
  const expected = config()
  if (!window.ethereum || !isAddress(account)) throw new Error('Connect MetaMask first.')
  const browser = new BrowserProvider(window.ethereum)
  if ((await browser.getNetwork()).chainId !== expected.chainId) throw new Error('Switch MetaMask to the configured chain.')
  if (await browser.getCode(expected.address) === '0x') throw new Error('The pool contract is not available in MetaMask.')
  const signer = await browser.getSigner(account)
  if ((await signer.getAddress()).toLowerCase() !== account.toLowerCase()) throw new Error('The selected MetaMask account changed. Reconnect and try again.')
  const pool = new Contract(expected.address, abi, signer)
  if ((await pool.asset() as string).toLowerCase() !== data.assetAddress.toLowerCase()) throw new Error('MetaMask points to a different pool deployment. Refresh the page.')
  const token = new Contract(data.assetAddress, tokenAbi, signer)
  const amount = action.amount ?? 0n
  const needsAmount = action.kind !== 'claim'
  if (needsAmount && amount <= 0n) throw new Error('Enter an amount greater than zero.')
  if (action.kind === 'request') {
    const days = action.durationDays ?? 0
    if (!Number.isInteger(days) || days < 1 || days > 365) throw new Error('Loan duration must be 1–365 days.')
    const preview = await previewLoan(account, amount, days)
    if (preview.reason !== 0n) throw new Error(eligibilityText(preview.reason))
  }
  if (action.kind === 'deposit' && data.verified !== true) throw new Error('Identity must be verified by the pool admin before depositing.')
  if (action.kind === 'withdraw' && amount > (data.withdrawable ?? 0n)) throw new Error('Amount exceeds your withdrawable principal.')
  if (action.kind === 'unstake' && amount > (data.freeStake ?? 0n)) throw new Error('Amount exceeds your free stake.')
  if (action.kind === 'repay' && (!action.loanId || !data.activeLoan || amount > data.activeLoan.totalRepayment - data.activeLoan.amountPaid)) throw new Error('Amount exceeds the active loan debt.')
  if (action.kind === 'claim' && (data.saver?.claimableReturn ?? 0n) <= 0n) throw new Error('No Saver return is available to claim.')

  const needsApproval = action.kind === 'deposit' || action.kind === 'stake' || action.kind === 'repay'
  if (needsApproval) {
    if (amount > data.walletBalance) throw new Error('Amount exceeds your token balance.')
    const allowance = await token.allowance(account, expected.address) as bigint
    if (allowance < amount) {
      onProgress({ stage: 'awaiting-wallet', label: 'Approve token spending in MetaMask' })
      const approval = await token.approve(expected.address, amount)
      onProgress({ stage: 'confirming', label: 'Waiting for token approval', hash: approval.hash })
      const approvalReceipt = await approval.wait()
      if (!approvalReceipt || approvalReceipt.status !== 1) throw new Error('Token approval did not confirm.')
      if (await token.allowance(account, expected.address) < amount) throw new Error('Token allowance did not update after approval.')
    }
  }

  onProgress({ stage: 'awaiting-wallet', label: 'Confirm the pool transaction in MetaMask' })
  const tx = action.kind === 'deposit' ? await pool.deposit(amount)
    : action.kind === 'withdraw' ? await pool.withdraw(amount)
      : action.kind === 'stake' ? await pool.stake(amount)
        : action.kind === 'unstake' ? await pool.unstake(amount)
          : action.kind === 'request' ? await pool.requestLoan(amount, BigInt(action.durationDays!) * 86400n)
            : action.kind === 'repay' ? await pool.repayLoan(action.loanId, amount)
              : await pool.claimReturn()
  onProgress({ stage: 'submitted', label: 'Transaction submitted', hash: tx.hash })
  onProgress({ stage: 'confirming', label: 'Waiting for on-chain confirmation', hash: tx.hash })
  const receipt = await tx.wait()
  if (!receipt || receipt.status !== 1) throw new Error('Transaction did not confirm.')
  onProgress({ stage: 'confirmed', label: 'Transaction confirmed on-chain', hash: tx.hash })
  return receipt
}

export function actionError(cause: unknown) { return cause instanceof Error && !('code' in cause) ? cause.message : readableError(cause) }
