'use client'

interface RatingButtonsProps {
  onRate: (rating: 0 | 3 | 5) => void
  disabled?: boolean
}

export default function RatingButtons({ onRate, disabled = false }: RatingButtonsProps) {
  return (
    <div className="flex gap-3 w-full">
      <button
        onClick={() => onRate(0)}
        disabled={disabled}
        className="flex-1 bg-red-600 hover:bg-red-500 active:bg-red-700
          disabled:opacity-50 disabled:cursor-not-allowed
          text-white font-bold py-4 rounded-xl transition-colors text-base
          flex flex-col items-center gap-1"
      >
        <span className="text-xl">😵</span>
        <span>모름</span>
      </button>
      <button
        onClick={() => onRate(3)}
        disabled={disabled}
        className="flex-1 bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-700
          disabled:opacity-50 disabled:cursor-not-allowed
          text-white font-bold py-4 rounded-xl transition-colors text-base
          flex flex-col items-center gap-1"
      >
        <span className="text-xl">🤔</span>
        <span>애매함</span>
      </button>
      <button
        onClick={() => onRate(5)}
        disabled={disabled}
        className="flex-1 bg-green-600 hover:bg-green-500 active:bg-green-700
          disabled:opacity-50 disabled:cursor-not-allowed
          text-white font-bold py-4 rounded-xl transition-colors text-base
          flex flex-col items-center gap-1"
      >
        <span className="text-xl">✅</span>
        <span>확실</span>
      </button>
    </div>
  )
}
