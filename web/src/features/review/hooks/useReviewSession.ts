'use client'

import { useState, useEffect, useCallback } from 'react'
import { getTodayReviews, submitReview, type Card } from '@/lib/api'

export function useReviewSession() {
  const [cards, setCards] = useState<Card[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const loadCards = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getTodayReviews()
      setCards(data)
      if (data.length === 0) setDone(true)
    } catch {
      setError('카드를 불러올 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCards()
  }, [loadCards])

  const handleRate = async (rating: 0 | 3 | 5) => {
    if (submitting) return
    const card = cards[currentIndex]
    if (!card) return

    setSubmitting(true)
    try {
      await submitReview(card.id, rating)
      const next = currentIndex + 1
      if (next >= cards.length) {
        setDone(true)
      } else {
        setCurrentIndex(next)
        setRevealed(false)
      }
    } catch {
      setError('평가 제출에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const currentCard = cards[currentIndex] ?? null
  const total = cards.length
  const progress = total > 0 ? (currentIndex / total) * 100 : 0

  return {
    cards,
    currentCard,
    currentIndex,
    total,
    showAnswer: revealed,
    setShowAnswer: setRevealed,
    progress,
    loading,
    submitting,
    error,
    done,
    handleRate,
    retry: loadCards,
  }
}
