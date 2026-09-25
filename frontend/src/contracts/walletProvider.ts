export type InjectedProvider = {
  isMetaMask?: boolean
  providers?: InjectedProvider[]
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
  on?: (event: 'accountsChanged' | 'chainChanged', handler: (...args: unknown[]) => void) => void
  removeListener?: (event: 'accountsChanged' | 'chainChanged', handler: (...args: unknown[]) => void) => void
}

type Eip6963ProviderDetail = {
  info: {
    rdns: string
  }
  provider: InjectedProvider
}

declare global {
  interface Window {
    ethereum?: InjectedProvider
  }
}

let activeProvider: InjectedProvider | null = null
let discoveryStarted = false
const subscribers = new Set<(provider: InjectedProvider | null) => void>()

function isMetaMask(provider: InjectedProvider, rdns?: string) {
  return provider.isMetaMask === true || rdns === 'io.metamask'
}

function providerFromWindow() {
  const injected = window.ethereum
  if (!injected) return null
  const providers = Array.isArray(injected.providers) ? injected.providers : []
  return providers.find(provider => isMetaMask(provider)) || injected
}

function selectProvider(provider: InjectedProvider, rdns?: string) {
  if (activeProvider && isMetaMask(activeProvider) && !isMetaMask(provider, rdns)) return
  if (activeProvider === provider) return
  activeProvider = provider
  subscribers.forEach(subscriber => subscriber(activeProvider))
}

function startDiscovery() {
  if (discoveryStarted || typeof window === 'undefined') return
  discoveryStarted = true

  const announced = (event: Event) => {
    const detail = (event as CustomEvent<Eip6963ProviderDetail>).detail
    if (detail?.provider) selectProvider(detail.provider, detail.info?.rdns)
  }

  window.addEventListener('eip6963:announceProvider', announced)
  const injected = providerFromWindow()
  if (injected) selectProvider(injected)
  window.dispatchEvent(new Event('eip6963:requestProvider'))

  // Some extensions inject after the app has mounted and do not announce EIP-6963.
  window.setTimeout(() => {
    const lateInjected = providerFromWindow()
    if (lateInjected) selectProvider(lateInjected)
  }, 750)
}

export function getWalletProvider() {
  startDiscovery()
  return activeProvider || providerFromWindow()
}

export function subscribeWalletProvider(subscriber: (provider: InjectedProvider | null) => void) {
  subscribers.add(subscriber)
  startDiscovery()
  subscriber(activeProvider || providerFromWindow())
  return () => subscribers.delete(subscriber)
}
