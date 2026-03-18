import type { Tag } from '@/lib/api'

interface TagBadgeProps {
  tag: Tag
  size?: 'sm' | 'md'
}

const tagStyles: Record<Tag, string> = {
  linux: 'bg-blue-900 text-blue-300 border border-blue-700',
  docker: 'bg-cyan-900 text-cyan-300 border border-cyan-700',
  k8s: 'bg-purple-900 text-purple-300 border border-purple-700',
  general: 'bg-gray-700 text-gray-300 border border-gray-600',
}

const tagLabels: Record<Tag, string> = {
  linux: 'Linux',
  docker: 'Docker',
  k8s: 'K8s',
  general: 'General',
}

export default function TagBadge({ tag, size = 'sm' }: TagBadgeProps) {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
  return (
    <span className={`inline-block rounded-md font-medium ${sizeClass} ${tagStyles[tag]}`}>
      {tagLabels[tag]}
    </span>
  )
}
