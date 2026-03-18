'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function MarkdownBody({ content, className }: { content: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <div className="overflow-x-auto mb-2">
              <table className="w-full text-sm border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-gray-700">{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className="border-b border-gray-700">{children}</tr>,
          th: ({ children }) => (
            <th className="text-left px-3 py-1.5 text-gray-300 font-semibold">{children}</th>
          ),
          td: ({ children }) => <td className="px-3 py-1.5 text-gray-300">{children}</td>,
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-0.5">{children}</ol>,
          li: ({ children }) => <li className="ml-2">{children}</li>,
          code: ({ children }) => (
            <code className="bg-gray-700 text-indigo-300 text-xs px-1.5 py-0.5 rounded font-mono">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-gray-900 rounded-lg p-3 mb-2 overflow-x-auto text-xs font-mono text-gray-300">
              {children}
            </pre>
          ),
          strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
