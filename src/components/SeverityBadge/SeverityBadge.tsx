import React from 'react'
import { SeverityLevel } from '../../types'

interface SeverityBadgeProps {
  severity: SeverityLevel
  showLabel?: boolean
  className?: string
}

const severityConfig = {
  info: {
    color: 'bg-primary-100 text-primary-800 border-primary-300',
    icon: 'ℹ',
    label: 'Info',
  },
  warning: {
    color: 'bg-warning-100 text-warning-800 border-warning-300',
    icon: '⚠',
    label: 'Warning',
  },
  critical: {
    color: 'bg-danger-100 text-danger-800 border-danger-300',
    icon: '✕',
    label: 'Critical',
  },
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  showLabel = true,
  className = '',
}) => {
  const config = severityConfig[severity]

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${config.color} ${className}`}
      role="status"
      aria-label={`Severity: ${config.label}`}
    >
      <span aria-hidden="true">{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}
