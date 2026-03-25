'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCards } from '@/features/cards/hooks/useCards'
import CardList from '@/features/cards/components/CardList'

function CardsContent() {
  const { cards, selectedTag, setSelectedTag, isLoading, error, retry } = useCards()
  const searchParams = useSearchParams()
  const highlightId = searchParams.get('highlight')

  return (
    <CardList
      cards={cards}
      selectedTag={selectedTag}
      onTagChange={setSelectedTag}
      isLoading={isLoading}
      error={error}
      onRetry={retry}
      highlightId={highlightId}
    />
  )
}

export default function CardsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="pt-2">
        <h1 className="text-xl font-bold text-white">카드 목록</h1>
      </div>
      <Suspense>
        <CardsContent />
      </Suspense>
    </div>
  )
}
