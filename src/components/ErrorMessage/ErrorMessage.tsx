import React from 'react'

interface ErrorMessageProps {
  title: string
  error?: unknown
  onRetry?: () => void
  className?: string
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  error,
  onRetry,
  className = '',
}) => {
  const detail = error instanceof Error ? error.message : undefined

  return (
    <div
      role="alert"
      className={`bg-red-50 border border-red-200 rounded-xl p-6 text-center ${className}`}
    >
      <p className="font-semibold text-red-800">{title}</p>
      {detail && <p className="text-sm text-red-700 mt-1">{detail}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 px-3 py-1.5 text-sm rounded-lg bg-white border border-red-300 text-red-800 hover:bg-red-100"
        >
          Retry
        </button>
      )}
    </div>
  )
}
