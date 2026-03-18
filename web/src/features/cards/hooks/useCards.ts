'use client'

import { useState, useEffect, useCallback } from 'react'
import { getCards, type Card, type Tag } from '@/lib/api'

type FilterTag = 'all' | Tag

export function useCards() {
  const [cards, setCards] = useState<Card[]>([])
  const [selectedTag, setSelectedTag] = useState<FilterTag>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCards = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getCards(
        selectedTag !== 'all' ? { tag: selectedTag } : undefined
      )
      setCards(data)
    } catch {
      setError('카드를 불러올 수 없습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [selectedTag])

  useEffect(() => {
    loadCards()
  }, [loadCards])

  return {
    cards,
    selectedTag,
    setSelectedTag,
    isLoading,
    error,
    retry: loadCards,
  }
}
