'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getRelations, getSuggestedRelations, addRelation, type RelatedCard } from '@/lib/api'
import TagBadge from '@/components/ui/TagBadge'
import type { Tag } from '@/lib/api'

interface Props {
  cardId: string
}

export default function CardRelations({ cardId }: Props) {
  const [relations, setRelations] = useState<RelatedCard[]>([])
  const [suggestions, setSuggestions] = useState<RelatedCard[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    getRelations(cardId).then(setRelations).catch(() => null)
  }, [cardId])

  const related = relations.filter((r) => r.relationType === 'related')
  const deepdive = relations
    .filter((r) => r.relationType === 'deepdive')
    .sort((a, b) => a.depth - b.depth)

  const handleShowSuggestions = async () => {
    setShowSuggestions(true)
    setLoadingSuggestions(true)
    try {
      const data = await getSuggestedRelations(cardId)
      const existingIds = new Set(relations.map((r) => r.id))
      setSuggestions(data.filter((s) => !existingIds.has(s.id)))
    } catch {
      setSuggestions([])
    } finally {
      setLoadingSuggestions(false)
    }
  }

  const handleAddRelation = async (suggestion: RelatedCard, type: 'related' | 'deepdive') => {
    const depth = type === 'deepdive' ? deepdive.length + 1 : 0
    await addRelation(cardId, { toCardId: suggestion.id, type, depth })
    const updated = await getRelations(cardId)
    setRelations(updated)
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id))
  }

  if (relations.length === 0 && !showSuggestions) {
    return (
      <button
        onClick={handleShowSuggestions}
        className="mt-5 text-xs text-indigo-400 hover:text-indigo-300 py-2"
      >
        + 연관 카드 추천 받기
      </button>
    )
  }

  return (
    <div className="mt-5 space-y-4">
      {/* 관련 개념 */}
      {related.length > 0 && (
        <div>
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">관련 개념</p>
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/cards?highlight=${r.id}`}
                className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 transition-colors"
              >
                <TagBadge tag={r.tag as Tag} />
                <span className="text-gray-300 text-xs">{r.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 딥다이브 경로 */}
      {deepdive.length > 0 && (
        <div>
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">딥다이브 경로</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            {deepdive.map((r, i) => (
              <div key={r.id} className="flex items-center gap-1.5">
                <Link
                  href={`/cards?highlight=${r.id}`}
                  className="bg-indigo-900/50 hover:bg-indigo-900/80 border border-indigo-700/50 rounded-lg px-3 py-2 text-xs text-indigo-300 transition-colors"
                >
                  {i + 1}단계 · {r.title}
                </Link>
                {i < deepdive.length - 1 && <span className="text-gray-600 text-xs">→</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 추천 */}
      {showSuggestions && (
        <div>
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">추천 연관 카드</p>
          {loadingSuggestions ? (
            <p className="text-xs text-gray-600">분석 중...</p>
          ) : suggestions.length === 0 ? (
            <p className="text-xs text-gray-600">추천할 카드가 없습니다</p>
          ) : (
            <div className="space-y-2">
              {suggestions.map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs flex-1 truncate">{s.title}</span>
                  {s.similarity !== undefined && (
                    <span className="text-gray-600 text-xs">{s.similarity}%</span>
                  )}
                  <button
                    onClick={() => handleAddRelation(s, 'related')}
                    className="text-xs text-blue-400 hover:text-blue-300 py-1.5 px-2"
                  >
                    관련
                  </button>
                  <button
                    onClick={() => handleAddRelation(s, 'deepdive')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 py-1.5 px-2"
                  >
                    딥다이브
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!showSuggestions && (
        <button
          onClick={handleShowSuggestions}
          className="text-xs text-indigo-400 hover:text-indigo-300 py-2"
        >
          + 더 추천 받기
        </button>
      )}
    </div>
  )
}
