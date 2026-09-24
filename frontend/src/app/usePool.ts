import { useCallback, useEffect, useState } from 'react'
import { readPool, type PoolData } from '../contracts/loanch'

export function usePool(account: string, connected: boolean) {
  const [data, setData] = useState<PoolData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [revision, setRevision] = useState(0)
  const refresh = useCallback(() => setRevision(value => value + 1), [])

  useEffect(() => {
    let current = true
    void Promise.resolve().then(async () => {
      setLoading(true)
      setError('')
      setData(null)
      try {
        const snapshot = await readPool(connected ? account : undefined)
        if (current) setData(snapshot)
      } catch (cause) {
        if (current) setError(cause instanceof Error ? cause.message : 'Could not read the pool contract.')
      } finally {
        if (current) setLoading(false)
      }
    })
    return () => { current = false }
  }, [account, connected, revision])

  return { data, error, loading, refresh }
}
