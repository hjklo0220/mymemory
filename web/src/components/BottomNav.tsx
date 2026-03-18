'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: '홈', icon: '🏠' },
  { href: '/review', label: '복습', icon: '📖' },
  { href: '/add', label: '추가', icon: '➕' },
  { href: '/cards', label: '목록', icon: '📋' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
      <div className="max-w-md mx-auto flex">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors
                ${isActive
                  ? 'text-indigo-400'
                  : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
      {/* iOS safe area spacer */}
      <div className="h-safe-area-inset-bottom bg-gray-900" />
    </nav>
  )
}
