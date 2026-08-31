import { useState } from 'react'

export function useSeenOnce(key: string): [boolean, () => void] {
  const storageKey = `seen:${key}`
  const [seen, setSeenState] = useState(() => {
    try {
      return sessionStorage.getItem(storageKey) === '1'
    } catch {
      return false
    }
  })

  const markSeen = () => {
    try {
      sessionStorage.setItem(storageKey, '1')
    } catch {
      // ignore storage errors (private mode, etc.)
    }
    setSeenState(true)
  }

  return [seen, markSeen]
}
