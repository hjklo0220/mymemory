'use client'

import { useState } from 'react'
import type { Card, Tag } from '@/lib/api'
import CardItem from './CardItem'

type FilterTag = 'all' | Tag
type SortOrder = 'newest' | 'review'

const FILTER_TABS: { value: FilterTag; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'linux', label: 'Linux' },
  { value: 'docker', label: 'Docker' },
  { value: 'k8s', label: 'K8s' },
  { value: 'general', label: 'General' },
]

const PAGE_SIZE = 20

interface CardListProps {
  cards: Card[]
  selectedTag: FilterTag
  onTagChange: (tag: FilterTag) => void
  isLoading: boolean
  error: string | null
  onRetry: () => void
  highlightId?: string | null
}

export default function CardList({
  cards,
  selectedTag,
  onTagChange,
  isLoading,
  error,
  onRetry,
  highlightId,
}: CardListProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const sortedCards = [...cards].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    return new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime()
  })

  const visibleCards = sortedCards.slice(0, visibleCount)
  const hasMore = visibleCount < sortedCards.length

  return (
    <div className="flex flex-col gap-4">
      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { onTagChange(tab.value); setVisibleCount(PAGE_SIZE) }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedTag === tab.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200 border border-gray-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
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
            onClick={onRetry}
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
        <div className="flex flex-col gap-3">
          {/* Sort + count */}
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">{cards.length}장의 카드</p>
            <div className="flex gap-1">
              <button
                onClick={() => setSortOrder('newest')}
                className={`text-xs px-2.5 py-1.5 rounded-lg transition-colors
                  ${sortOrder === 'newest' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                최신순
              </button>
              <button
                onClick={() => setSortOrder('review')}
                className={`text-xs px-2.5 py-1.5 rounded-lg transition-colors
                  ${sortOrder === 'review' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                복습순
              </button>
            </div>
          </div>

          {/* Cards */}
          {visibleCards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              highlighted={card.id === highlightId}
            />
          ))}

          {/* Load more */}
          {hasMore && (
            <button
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              className="w-full py-3 text-sm text-gray-400 hover:text-gray-200
                bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-gray-700
                transition-colors"
            >
              더보기 ({sortedCards.length - visibleCount}장 남음)
            </button>
          )}
        </div>
      )}
    </div>
  )
}
