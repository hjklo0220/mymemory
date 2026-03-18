'use client'

import { useState, useEffect, useCallback } from 'react'
import { getTodayReviews, submitReview, type Card } from '@/lib/api'
import FlashCard from '@/components/FlashCard'
import RatingButtons from '@/components/RatingButtons'

export default function ReviewPage() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400 text-center">
          <div className="text-4xl mb-3 animate-pulse">📖</div>
          <p>카드 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadCards}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  if (done || cards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">오늘 복습 완료!</h2>
          <p className="text-gray-400 mb-6">모든 카드를 복습했어요</p>
          <a
            href="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white
              font-bold py-3 px-8 rounded-xl transition-colors"
          >
            홈으로
          </a>
        </div>
      </div>
    )
  }

  const currentCard = cards[currentIndex]
  const total = cards.length
  const progress = ((currentIndex) / total) * 100

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-lg font-bold text-white">복습</h1>
        <span className="text-gray-400 text-sm font-medium">
          {currentIndex + 1} / {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Flash Card */}
      <FlashCard
        key={currentCard.id + currentIndex}
        card={currentCard}
        revealed={revealed}
        onReveal={() => setRevealed(true)}
      />

      {/* Rating Buttons — only shown when revealed */}
      {revealed && (
        <div className="mt-2">
          <p className="text-gray-400 text-sm text-center mb-3">얼마나 기억하나요?</p>
          <RatingButtons onRate={handleRate} disabled={submitting} />
        </div>
      )}
    </div>
  )
}
