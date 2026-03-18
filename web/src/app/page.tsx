import Link from 'next/link'
import { getCards, getTodayReviews } from '@/lib/api'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let todayCount = 0
  let totalCount = 0
  let error = false

  try {
    const [todayCards, allCards] = await Promise.all([
      getTodayReviews(),
      getCards(),
    ])
    todayCount = todayCards.length
    totalCount = allCards.length
  } catch {
    error = true
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl font-bold text-white">MyMemory</h1>
        <p className="text-gray-400 text-sm mt-1">DevOps 학습 카드 복습</p>
      </div>

      {/* Today review card */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        {error ? (
          <div className="text-center">
            <p className="text-gray-400 text-sm">서버에 연결할 수 없습니다</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">오늘 복습할 카드</p>
            <p className="text-6xl font-bold text-indigo-400 leading-none">
              {todayCount}
            </p>
            <p className="text-gray-400 text-sm mt-2">장</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <Link
          href="/review"
          className={`
            w-full py-5 rounded-2xl text-center font-bold text-lg transition-colors
            ${todayCount > 0
              ? 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white'
              : 'bg-gray-700 text-gray-400 cursor-default pointer-events-none'
            }
          `}
        >
          {todayCount > 0 ? '복습 시작' : '오늘 복습 완료!'}
        </Link>

        <Link
          href="/add"
          className="w-full py-5 rounded-2xl text-center font-bold text-lg
            bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-white transition-colors"
        >
          카드 추가
        </Link>
      </div>

      {/* Stats */}
      {!error && (
        <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">전체 카드</span>
            <span className="text-white font-semibold">{totalCount}장</span>
          </div>
        </div>
      )}
    </div>
  )
}
