export type Category =
  | 'Food'
  | 'Nature'
  | 'Animals'
  | 'Fun'
  | 'Travel'
  | 'Sports'
  | 'Music'
  | 'City'

export type Reaction = 'like' | 'notInterested'

export type ReactionMap = Record<string, Reaction>

export interface CategorisedVideo {
  id: string
  category: Category
}

// Initial demonstration scores.
export const BASE_SCORES: Record<Category, number> = {
  Food: 78,
  Nature: 74,
  Animals: 82,
  Fun: 70,
  Travel: 66,
  Sports: 62,
  Music: 58,
  City: 54,
}

// Clicking the same reaction again removes it.
export function toggleReaction(
  old: ReactionMap,
  id: string,
  reaction: Reaction,
): ReactionMap {
  const next = { ...old }

  if (next[id] === reaction) {
    delete next[id]
  } else {
    next[id] = reaction
  }

  return next
}

// Simulated behaviour-based preference inference.
export function scorePreferences(
  feedback: ReactionMap,
  catalog: readonly CategorisedVideo[],
): Record<Category, number> {
  const scores = { ...BASE_SCORES }

  for (const video of catalog) {
    const reaction = feedback[video.id]

    if (!reaction) continue

    const change = reaction === 'like' ? 15 : -25

    scores[video.category] = Math.max(
      0,
      Math.min(100, scores[video.category] + change),
    )
  }

  return scores
}

// Higher interest scores appear earlier in the feed.
export function rankVideos<T extends CategorisedVideo>(
  catalog: readonly T[],
  scores: Record<Category, number>,
): T[] {
  return [...catalog].sort(
    (a, b) => scores[b.category] - scores[a.category],
  )
}