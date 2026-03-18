'use client'

import { useState } from 'react'
import type { Card } from '@/lib/api'
import TagBadge from '@/components/ui/TagBadge'

interface FlashCardProps {
  card: Card
  onReveal?: () => void
  revealed?: boolean
}

export default function FlashCard({ card, onReveal, revealed = false }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(revealed)

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true)
      onReveal?.()
    }
  }

  // Sync external revealed prop
  if (revealed && !isFlipped) {
    setIsFlipped(true)
  }

  return (
    <div className="w-full">
      {/* Front face */}
      <div
        className={`
          bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl
          min-h-[200px] flex flex-col justify-between
          transition-all duration-300
        `}
      >
        <div className="flex items-start justify-between gap-2 mb-4">
          <h2 className="text-white text-xl font-bold leading-snug flex-1">
            {card.title}
          </h2>
          <TagBadge tag={card.tag} />
        </div>

        {!isFlipped ? (
          <button
            onClick={handleFlip}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700
              text-white font-semibold py-3 rounded-xl transition-colors text-base"
          >
            정답 보기
          </button>
        ) : (
          <div className="mt-4">
            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-200 text-base leading-relaxed whitespace-pre-wrap">
                {card.body}
              </p>
              {card.source && (
                <p className="mt-3 text-gray-500 text-sm">
                  출처: {card.source}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
