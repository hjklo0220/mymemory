'use client'

import type { RelatedCard } from '@/lib/api'

interface Props {
  hint: RelatedCard
  onAccept: () => void
  onDismiss: () => void
  loading?: boolean
}

export default function DeepDiveHint({ hint, onAccept, onDismiss, loading }: Props) {
  return (
    <div className="rounded-xl border border-indigo-700/50 bg-indigo-950/40 px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-indigo-400 text-base shrink-0">💡</span>
        <span className="text-indigo-300 text-sm truncate">{hint.title}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onAccept}
          disabled={loading}
          className="text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500
            disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          {loading ? '...' : '심화 보기 →'}
        </button>
        <button
          onClick={onDismiss}
          className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
        >
          건너뛰기
        </button>
      </div>
    </div>
  )
}
