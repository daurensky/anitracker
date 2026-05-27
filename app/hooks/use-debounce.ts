import { useRef, useCallback } from 'react'

export function useDebounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fnRef = useRef(fn)
  fnRef.current = fn  // всегда актуальная версия без пересоздания

  return useCallback(
    (...args: T) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => fnRef.current(...args), delay)
    },
    [delay]  // fn убрана из зависимостей — используем ref
  )
}