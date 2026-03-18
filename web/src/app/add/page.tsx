import CardForm from '@/features/cards/components/CardForm'

export default function AddPage() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-xl font-bold text-white">카드 추가</h1>
        <p className="text-gray-400 text-sm mt-1">새로운 학습 카드를 등록합니다</p>
      </div>

      <CardForm />
    </div>
  )
}
