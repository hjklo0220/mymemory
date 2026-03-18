'use client'

import { useCards } from '@/features/cards/hooks/useCards'
import CardList from '@/features/cards/components/CardList'

export default function CardsPage() {
  const { cards, selectedTag, setSelectedTag, isLoading, error, retry } = useCards()

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-xl font-bold text-white">카드 목록</h1>
      </div>

      <CardList
        cards={cards}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        isLoading={isLoading}
        error={error}
        onRetry={retry}
      />
    </div>
  )
}
