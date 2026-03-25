'use client'

import { useState, useEffect, useRef } from 'react'
import type { Card } from '@/lib/api'
import TagBadge from '@/components/ui/TagBadge'
import MarkdownBody from '@/components/ui/MarkdownBody'
import CardRelations from './CardRelations'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffMs = target.getTime() - today.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return '복습 대기'
  if (diffDays === 0) return '오늘'
  if (diffDays === 1) return '내일'
  return `${diffDays}일 후`
}

interface CardItemProps {
  card: Card
  highlighted?: boolean
}

export default function CardItem({ card, highlighted }: CardItemProps) {
  const [expanded, setExpanded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (highlighted) {
      setExpanded(true)
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }, [highlighted])

  return (
    <div
      ref={ref}
      className={`bg-gray-800 rounded-xl border overflow-hidden transition-all duration-200
        ${highlighted ? 'border-indigo-500 ring-1 ring-indigo-500/30' : 'border-gray-700'}`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-4 flex items-start justify-between gap-3"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <TagBadge tag={card.tag} />
            <span className="text-gray-500 text-xs">
              다음 복습: {formatDate(card.nextReviewAt)}
            </span>
          </div>
          <p className="text-white font-semibold text-[15px] leading-snug line-clamp-2">
            {card.title}
          </p>
        </div>
        <span
          className={`text-gray-500 text-lg flex-shrink-0 mt-0.5 transition-transform duration-200
            ${expanded ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-5 border-t border-gray-700">
          <MarkdownBody content={card.body} className="text-gray-300 text-sm leading-relaxed mt-4" />
          {card.source && (
            <p className="text-gray-500 text-xs mt-3">출처: {card.source}</p>
          )}
          <CardRelations cardId={card.id} />
          <div className="flex gap-4 mt-5 pt-4 border-t border-gray-700/50 text-xs text-gray-500">
            <span>반복: {card.repetitions}회</span>
            <span>간격: {card.interval}일</span>
          </div>
        </div>
      )}
    </div>
  )
}
