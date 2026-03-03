import React from 'react'
import type { ConnectionStatus } from '../types'

interface StatusIndicatorProps {
  status: ConnectionStatus
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const getConfig = () => {
    switch (status) {
      case 'connected':
        return {
          dotClass: 'text-emerald-400 bg-emerald-400',
          text: 'Live Connected',
        }
      case 'connecting':
        return {
          dotClass: 'text-sky-300 bg-sky-300',
          text: 'Connecting...',
        }
      case 'reconnecting':
        return {
          dotClass: 'text-amber-300 bg-amber-300',
          text: 'Reconnecting...',
        }
      case 'error':
        return {
          dotClass: 'text-rose-400 bg-rose-400',
          text: 'Live Updates Unavailable',
        }
      default:
        return {
          dotClass: 'text-slate-400 bg-slate-400',
          text: 'Offline',
        }
    }
  }

  const config = getConfig()

  return (
    <div className="status-chip flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-[0.08em] uppercase">
      <div
        className={`status-dot ${config.dotClass} ${status === 'reconnecting' ? 'pulse' : ''}`}
      />
      <span>{config.text}</span>
    </div>
  )
}
