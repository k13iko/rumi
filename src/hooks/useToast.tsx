import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

// An optional button shown inside the toast, like "Undo"
export interface ToastAction {
  label: string
  onClick: () => void
}

interface ToastState {
  message: string
  action?: ToastAction
}

// show("text") for a plain toast, show("text", { label, onClick }) to add a button
export function useToast(): { show: (message: string, action?: ToastAction) => void; node: ReactNode } {
  const [toast, setToast] = useState<ToastState | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const show = useCallback((message: string, action?: ToastAction) => {
    setToast({ message, action })
    clearTimeout(timer.current)
    // Toasts with a button stay longer so there's time to click it
    timer.current = setTimeout(() => setToast(null), action ? 6000 : 2600)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  const node = toast ? (
    <div className="toast" role="status">
      {toast.message}
      {toast.action && (
        <button
          type="button"
          onClick={() => {
            toast.action?.onClick() // do the action (undo)
            setToast(null) // then hide the toast
          }}
        >
          {toast.action.label}
        </button>
      )}
    </div>
  ) : null

  return { show, node }
}