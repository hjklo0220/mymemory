'use client'

import { useState } from 'react'
import { useReviewSession } from '@/features/review/hooks/useReviewSession'
import FlashCard from '@/features/review/components/FlashCard'
import RatingButtons from '@/features/review/components/RatingButtons'
import DeepDiveHint from '@/features/review/components/DeepDiveHint'
import { getRelations, getCard, type RelatedCard } from '@/lib/api'

export default function ReviewPage() {
  const {
    currentCard,
    currentIndex,
    total,
    showAnswer,
    setShowAnswer,
    progress,
    loading,
    error,
    done,
    submitting,
    handleRate,
    advance,
    insertNextCard,
    retry,
  } = useReviewSession()

  const [deepdiveHint, setDeepdiveHint] = useState<RelatedCard | null>(null)
  const [deepdiveLoading, setDeepdiveLoading] = useState(false)

  const onRate = async (rating: 0 | 3 | 5) => {
    await handleRate(rating)

    if (rating === 5 && currentCard && currentCard.interval >= 3) {
      try {
        const relations = await getRelations(currentCard.id)
        const deepdives = relations
          .filter((r) => r.relationType === 'deepdive')
          .sort((a, b) => a.depth - b.depth)
        if (deepdives.length > 0) {
          setDeepdiveHint(deepdives[0])
          return
        }
      } catch {
        // 힌트 실패는 조용히 무시하고 그냥 진행
      }
    }

    advance()
  }

  const handleDeepDiveAccept = async () => {
    if (!deepdiveHint) return
    setDeepdiveLoading(true)
    try {
      const card = await getCard(deepdiveHint.id)
      insertNextCard(card)
    } catch {
      // 카드 로드 실패 시 그냥 진행
    } finally {
      setDeepdiveLoading(false)
      setDeepdiveHint(null)
      advance()
    }
  }

  const handleDeepDiveDismiss = () => {
    setDeepdiveHint(null)
    advance()
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
            onClick={retry}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  if (done || !currentCard) {
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
        revealed={showAnswer}
        onReveal={() => setShowAnswer(true)}
      />

      {/* DeepDive Hint — shown after good rating when eligible */}
      {deepdiveHint && (
        <DeepDiveHint
          hint={deepdiveHint}
          onAccept={handleDeepDiveAccept}
          onDismiss={handleDeepDiveDismiss}
          loading={deepdiveLoading}
        />
      )}

      {/* Rating Buttons — hidden while deepdive hint is showing */}
      {showAnswer && !deepdiveHint && (
        <div className="mt-2">
          <p className="text-gray-400 text-sm text-center mb-3">얼마나 기억하나요?</p>
          <RatingButtons onRate={onRate} disabled={submitting} />
        </div>
      )}
    </div>
  )
}
