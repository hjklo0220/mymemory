const API_URL = typeof window === 'undefined'
  ? (process.env.API_INTERNAL_URL || 'http://api:3001')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')

export type Tag = 'linux' | 'docker' | 'k8s' | 'general'

export interface Card {
  id: string
  title: string
  body: string
  tag: Tag
  source?: string
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewAt: string
  createdAt: string
}

export interface CreateCardInput {
  title: string
  body: string
  tag: Tag
  source?: string
}

export interface UpdateCardInput {
  title?: string
  body?: string
  tag?: Tag
  source?: string
}

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`API error ${res.status}: ${error}`)
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as T
  }

  return res.json()
}

// Cards
export async function getCards(params?: { tag?: string; due?: boolean }): Promise<Card[]> {
  const query = new URLSearchParams()
  if (params?.tag) query.set('tag', params.tag)
  if (params?.due !== undefined) query.set('due', String(params.due))
  const qs = query.toString()
  return fetchAPI<Card[]>(`/cards${qs ? `?${qs}` : ''}`)
}

export async function getCard(id: string): Promise<Card> {
  return fetchAPI<Card>(`/cards/${id}`)
}

export async function createCard(data: CreateCardInput): Promise<Card> {
  return fetchAPI<Card>('/cards', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateCard(id: string, data: UpdateCardInput): Promise<Card> {
  return fetchAPI<Card>(`/cards/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function deleteCard(id: string): Promise<void> {
  return fetchAPI<void>(`/cards/${id}`, {
    method: 'DELETE',
  })
}

// Relations
export interface RelatedCard {
  id: string
  title: string
  tag: string
  relationType: 'related' | 'deepdive'
  depth: number
  similarity?: number
}

export async function getRelations(cardId: string): Promise<RelatedCard[]> {
  return fetchAPI<RelatedCard[]>(`/cards/${cardId}/relations`)
}

export async function getSuggestedRelations(cardId: string): Promise<RelatedCard[]> {
  return fetchAPI<RelatedCard[]>(`/cards/${cardId}/relations/suggestions`)
}

export async function addRelation(cardId: string, data: { toCardId: string; type: 'related' | 'deepdive'; depth: number }): Promise<void> {
  return fetchAPI<void>(`/cards/${cardId}/relations`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function removeRelation(cardId: string, relationId: string): Promise<void> {
  return fetchAPI<void>(`/cards/${cardId}/relations/${relationId}`, {
    method: 'DELETE',
  })
}

// Reviews
export async function getTodayReviews(): Promise<Card[]> {
  return fetchAPI<Card[]>('/reviews/today')
}

export async function submitReview(cardId: string, rating: 0 | 3 | 5): Promise<Card> {
  return fetchAPI<Card>('/reviews', {
    method: 'POST',
    body: JSON.stringify({ cardId, rating }),
  })
}
