'use client'

import { useState, useEffect, useCallback } from 'react'
import { getCards, type Card, type Tag } from '@/lib/api'
import TagBadge from '@/components/TagBadge'

type FilterTag = 'all' | Tag

const FILTER_TABS: { value: FilterTag; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'linux', label: 'Linux' },
  { value: 'docker', label: 'Docker' },
  { value: 'k8s', label: 'K8s' },
  { value: 'general', label: 'General' },
]

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

function CardItem({ card }: { card: Card }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden
        transition-all duration-200"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-4 flex items-start justify-between gap-3"
      >
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm leading-snug line-clamp-2">
            {card.title}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <TagBadge tag={card.tag} />
            <span className="text-gray-500 text-xs">
              다음 복습: {formatDate(card.nextReviewAt)}
            </span>
          </div>
        </div>
        <span
          className={`text-gray-500 text-lg flex-shrink-0 mt-0.5 transition-transform duration-200
            ${expanded ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-700">
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mt-3">
            {card.body}
          </p>
          {card.source && (
            <p className="text-gray-500 text-xs mt-3">출처: {card.source}</p>
          )}
          <div className="flex gap-4 mt-3 text-xs text-gray-600">
            <span>반복: {card.repetitions}회</span>
            <span>간격: {card.interval}일</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [filter, setFilter] = useState<FilterTag>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCards = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCards(
        filter !== 'all' ? { tag: filter } : undefined
      )
      setCards(data)
    } catch {
      setError('카드를 불러올 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    loadCards()
  }, [loadCards])

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-xl font-bold text-white">카드 목록</h1>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${filter === tab.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200 border border-gray-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-gray-400 text-center">
            <div className="text-4xl mb-3 animate-pulse">📋</div>
            <p>불러오는 중...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadCards}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl"
          >
            다시 시도
          </button>
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-400">카드가 없습니다</p>
          <a
            href="/add"
            className="inline-block mt-4 bg-indigo-600 hover:bg-indigo-500
              text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            카드 추가하기
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-gray-500 text-sm">{cards.length}장의 카드</p>
          {cards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  )
}
