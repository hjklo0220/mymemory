'use client'

import type { Card, Tag } from '@/lib/api'
import CardItem from './CardItem'

type FilterTag = 'all' | Tag

const FILTER_TABS: { value: FilterTag; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'linux', label: 'Linux' },
  { value: 'docker', label: 'Docker' },
  { value: 'k8s', label: 'K8s' },
  { value: 'general', label: 'General' },
]

interface CardListProps {
  cards: Card[]
  selectedTag: FilterTag
  onTagChange: (tag: FilterTag) => void
  isLoading: boolean
  error: string | null
  onRetry: () => void
}

export default function CardList({
  cards,
  selectedTag,
  onTagChange,
  isLoading,
  error,
  onRetry,
}: CardListProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTagChange(tab.value)}
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
