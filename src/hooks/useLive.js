import { useCallback, useEffect, useRef, useState } from 'react'

// Re-renders every `interval` ms so running clocks tick.
export function useNow(interval = 1000) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), interval)
    return () => window.clearInterval(id)
  }, [interval])

  return now
}

// Loads data immediately and then every `interval` ms while the tab is visible.
export function usePolling(load, interval, deps = []) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const loadRef = useRef(load)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    loadRef.current = load
  })

  useEffect(() => {
    let alive = true

    async function run(isRepeat) {
      // Background tabs skip refreshes, but the first load always runs.
      if (isRepeat && document.hidden) return
      try {
        const result = await loadRef.current()
        if (!alive) return
        setData(result)
        setError('')
      } catch (err) {
        if (alive) setError(err.message || 'تعذر تحميل البيانات.')
      } finally {
        if (alive) setLoading(false)
      }
    }

    run(false)
    const id = interval ? window.setInterval(() => run(true), interval) : null
    return () => {
      alive = false
      if (id) window.clearInterval(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval, version, ...deps])

  const reload = useCallback(() => setVersion((value) => value + 1), [])

  return { data, error, loading, reload }
}
