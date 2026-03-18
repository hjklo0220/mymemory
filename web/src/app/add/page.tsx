'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCard, type Tag } from '@/lib/api'

const TAGS: { value: Tag; label: string }[] = [
  { value: 'linux', label: 'Linux' },
  { value: 'docker', label: 'Docker' },
  { value: 'k8s', label: 'K8s' },
  { value: 'general', label: 'General' },
]

export default function AddPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tag, setTag] = useState<Tag>('general')
  const [source, setSource] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) {
      setError('제목과 내용을 입력해주세요.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await createCard({
        title: title.trim(),
        body: body.trim(),
        tag,
        source: source.trim() || undefined,
      })
      router.push('/')
    } catch {
      setError('카드 저장에 실패했습니다. 다시 시도해주세요.')
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-xl font-bold text-white">카드 추가</h1>
        <p className="text-gray-400 text-sm mt-1">새로운 학습 카드를 등록합니다</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            제목 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: Docker와 VM의 차이점"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3
              text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500
              focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            내용 <span className="text-red-400">*</span>
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="카드 뒷면에 표시될 내용을 입력하세요..."
            rows={6}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3
              text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500
              focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
          />
        </div>

        {/* Tag */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            태그
          </label>
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value as Tag)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3
              text-white focus:outline-none focus:border-indigo-500
              focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
          >
            {TAGS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            출처 <span className="text-gray-500 font-normal">(선택)</span>
          </label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="예: Docker 공식 문서"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3
              text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500
              focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/40 border border-red-700 rounded-xl px-4 py-3">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700
            disabled:opacity-50 disabled:cursor-not-allowed
            text-white font-bold py-4 rounded-xl transition-colors text-lg mt-2"
        >
          {submitting ? '저장 중...' : '저장'}
        </button>
      </form>
    </div>
  )
}
