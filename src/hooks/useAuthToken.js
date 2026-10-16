import { useCallback, useState } from 'react'
import { TOKEN_KEY } from '../config/appConfig'

export function useAuthToken() {
  const [token, setTokenState] = useState(() => localStorage.getItem(TOKEN_KEY) || '')

  const setToken = useCallback((nextToken) => {
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }

    setTokenState(nextToken || '')
  }, [])

  return { setToken, token }
}
