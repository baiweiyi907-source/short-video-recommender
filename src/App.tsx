import { useEffect, useMemo, useRef, useState } from 'react'
import { VerticalFeed, type VideoItem } from 'react-vertical-feed'
import {
  BASE_SCORES,
  rankVideos,
  scorePreferences,
  toggleReaction,
  type Category,
  type Reaction,
  type ReactionMap,
} from './recommendation'
import PreferenceControl from './PreferenceControl'
import './App.css'

type FeedVideo = VideoItem & {
  id: string
  title: string
  category: Category
  creator: string
  license: string
  sourcePage: string
}

const playback = {
  controls: true,
  autoPlay: true,
  muted: false,
  playsInline: true,
  loop: true,
  preload: 'metadata' as const,
}

const catalog: FeedVideo[] = [
  {
    id: 'food-cupcakes',
    src: '/videos/food.mp4',
    title: 'Freshly Made Cupcakes on Display at Butter Cream Bakery',
    category: 'Food',
    creator: 'Sarah Stierch',
    license: 'CC BY 4.0',
    sourcePage:
      'https://commons.wikimedia.org/wiki/File:Butter_Cream_Bakery_%26_Diner_-_February_2024_-_Sarah_Stierch.webm',
    ...playback,
  },
  {
    id: 'nature-waterfall',
    src: '/videos/nature.mp4',
    title: 'Breathtaking Sunrise Over the Clouds in Mawlangren',
    category: 'Nature',
    creator: 'BLMUtah',
    license: 'Public domain (US)',
    sourcePage:
      'https://commons.wikimedia.org/wiki/File:Day_2-_Spring_footage_of_Professor_Creek_Waterfall_(20088375152).webm',
    ...playback,
  },
  {
    id: 'animals-bird',
    src: '/videos/animals.mp4',
    title: 'Close Encounter with a Lion at Ishikawa Zoo in Japan',
    category: 'Animals',
    creator: 'Chuck Homler / FocusOnWildlife.Me',
    license: 'CC BY-SA 4.0',
    sourcePage:
      'https://commons.wikimedia.org/wiki/File:Male_Red-Winged_Blackbird_(Agelaius_phoeniceus)_Singing_-_John_Heinz_National_Wildlife_Refuge.webm',
    ...playback,
  },
  {
    id: 'fun-amusement',
    src: '/videos/fun.mp4',
    title: 'Thrilling Amusement Park Rides at Särkänniemi in Finland',
    category: 'Fun',
    creator: 'Sounds of Changes / Mikael Maffei',
    license: 'CC BY 3.0',
    sourcePage:
      'https://commons.wikimedia.org/wiki/File:S%C3%A4rk%C3%A4nniemi_Amusement_Park.webm',
    ...playback,
  },
  {
    id: 'travel-clouds',
    src: '/videos/travel.mp4',
    title: 'Exploring the Streets of San Francisco by Cable Car',
    category: 'Travel',
    creator: 'Wann Majaw',
    license: 'CC BY 4.0',
    sourcePage:
      'https://commons.wikimedia.org/wiki/File:Mawlangren_Above_the_Clouds.webm',
    ...playback,
  },
  {
    id: 'sports-basketball',
    src: '/videos/sports.mp4',
    title: 'Soccer Match Highlights from Incirlik Sports Day',
    category: 'Sports',
    creator: 'DavidforDance',
    license: 'CC BY 4.0',
    sourcePage:
      'https://commons.wikimedia.org/wiki/File:Special_Olympics_Basketball_running_2024.webm',
    ...playback,
  },
  {
    id: 'music-lion-dance',
    src: '/videos/music.mp4',
    title: 'Music and Cultural Celebrations at WikiConvention in Cotonou',
    category: 'Music',
    creator: 'FeaturingDallas',
    license: 'CC BY 4.0',
    sourcePage:
      'https://commons.wikimedia.org/wiki/File:Lion_Dance_2025.webm',
    ...playback,
  },
  {
    id: 'city-night-market',
    src: '/videos/city.mp4',
    title: "Panoramic Aerial Views of Pereira's Urban Landscape",
    category: 'City',
    creator: 'Bim24',
    license: 'CC BY-SA 4.0',
    sourcePage:
      'https://commons.wikimedia.org/wiki/File:CARBON_NIGHT_MARKET_(1).webm',
    ...playback,
  },
]

const STORAGE_KEY = 'clarityfeed-preferences-v1'

interface SavedPreferences {
  feedback: ReactionMap
  manualAdjustments: Partial<Record<Category, number>>
}

const categories: Category[] = [
  'Food',
  'Nature',
  'Animals',
  'Fun',
  'Travel',
  'Sports',
  'Music',
  'City',
]

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  )
}

function loadSavedPreferences(): SavedPreferences {
  const empty: SavedPreferences = {
    feedback: {},
    manualAdjustments: {},
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return empty

    const saved: unknown = JSON.parse(raw)

    if (!isRecord(saved) || saved.version !== 1) {
      return empty
    }

    const feedback: ReactionMap = {}

    if (isRecord(saved.feedback)) {
      for (const video of catalog) {
        const value = saved.feedback[video.id]

        if (
          value === 'like' ||
          value === 'notInterested'
        ) {
          feedback[video.id] = value
        }
      }
    }

    const manualAdjustments:
      Partial<Record<Category, number>> = {}

    if (isRecord(saved.manualAdjustments)) {
      for (const category of categories) {
        const value = saved.manualAdjustments[category]

        if (
          typeof value === 'number' &&
          Number.isInteger(value) &&
          value >= 0 &&
          value <= 100
        ) {
          manualAdjustments[category] = value
        }
      }
    }

    return { feedback, manualAdjustments }
  } catch {
    return empty
  }
}

function App() {
  const [savedAtStart] = useState(loadSavedPreferences)

  const [page, setPage] =
    useState<'feed' | 'preferences'>('feed')

  const [feedback, setFeedback] =
    useState<ReactionMap>(savedAtStart.feedback)

  const [manualAdjustments, setManualAdjustments] =
    useState<Partial<Record<Category, number>>>(
      savedAtStart.manualAdjustments,
    )

  const [visibleVideos, setVisibleVideos] =
    useState<FeedVideo[]>(() =>
      rankVideos(catalog, {
        ...scorePreferences(savedAtStart.feedback, catalog),
        ...savedAtStart.manualAdjustments,
      }),
    )

  const [feedVersion, setFeedVersion] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  const [explanationOpen, setExplanationOpen] =
    useState(false)

  const [history, setHistory] =
    useState<ReactionMap[]>([])

  const [notice, setNotice] = useState(
    Object.keys(savedAtStart.feedback).length > 0 ||
      Object.keys(savedAtStart.manualAdjustments).length > 0
      ? 'Saved preferences restored from this browser.'
      : 'Your feedback will update the preference model.',
  )

  const [autoplayBlocked, setAutoplayBlocked] =
    useState(false)

  const feedPanelRef = useRef<HTMLElement | null>(null)
  const activeIndexRef = useRef(0)

  const scores = useMemo(
    () => ({
      ...scorePreferences(feedback, catalog),
      ...manualAdjustments,
    }),
    [feedback, manualAdjustments],
  )

  const suggestedVideos = useMemo(
    () => rankVideos(catalog, scores),
    [scores],
  )

  const orderChanged = suggestedVideos.some(
    (item, index) =>
      item.id !== visibleVideos[index]?.id,
  )

  const currentVideo =
    visibleVideos[currentIndex] ?? visibleVideos[0]

  const selectedReaction = feedback[currentVideo.id]
  const currentScore = scores[currentVideo.category]

  useEffect(() => {
    try {
      const hasData =
        Object.keys(feedback).length > 0 ||
        Object.keys(manualAdjustments).length > 0

      if (hasData) {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            version: 1,
            feedback,
            manualAdjustments,
          }),
        )
      } else {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // Continue without persistent storage.
    }
  }, [feedback, manualAdjustments])

  function handleVideoChange(index: number) {
    const safe =
      Number.isInteger(index) &&
      index >= 0 &&
      index < visibleVideos.length
        ? index
        : 0

    activeIndexRef.current = safe
    setCurrentIndex(safe)
    setExplanationOpen(false)
  }

  function reactToCurrent(reaction: Reaction) {
    const next = toggleReaction(
      feedback,
      currentVideo.id,
      reaction,
    )

    setHistory([...history, feedback])
    setFeedback(next)

    const manualScore =
      manualAdjustments[currentVideo.category]

    if (manualScore !== undefined) {
      setNotice(
        `Feedback ${
          next[currentVideo.id] ? 'recorded' : 'removed'
        }. Your manually selected ${
          currentVideo.category
        } score stays at ${manualScore}/100.`,
      )
    } else {
      setNotice(
        next[currentVideo.id]
          ? `Feedback recorded for ${currentVideo.category}. Interest score updated.`
          : `Feedback removed from this ${currentVideo.category} video.`,
      )
    }
  }

  function undoLast() {
    if (history.length === 0) return

    setFeedback(history[history.length - 1])
    setHistory(history.slice(0, -1))

    setNotice(
      'Last feedback undone. Review the new ranking preview.',
    )
  }

  function applyNewOrder() {
    if (!orderChanged) return

    setVisibleVideos([...suggestedVideos])
    setCurrentIndex(0)
    activeIndexRef.current = 0
    setFeedVersion(version => version + 1)

    setExplanationOpen(false)
    setAutoplayBlocked(false)

    setNotice(
      'Recommendations updated. The feed starts from its highest-ranked video.',
    )
  }

  function handleVideoError(
    _item: VideoItem,
    index: number,
    error: Error,
  ) {
    if (
      index === activeIndexRef.current &&
      error.name === 'NotAllowedError'
    ) {
      setAutoplayBlocked(true)
    }
  }

  function startWithSound() {
    const video =
      feedPanelRef.current?.querySelector<HTMLVideoElement>(
        `[data-index="${activeIndexRef.current}"] video`,
      )

    if (!video) return

    video.muted = false

    void video.play().then(
      () => setAutoplayBlocked(false),
      () => setAutoplayBlocked(true),
    )
  }

  function updatePreference(
    category: Category,
    value: number,
  ) {
    const clampedValue = Math.max(
      0,
      Math.min(100, Math.round(value)),
    )

    setManualAdjustments(previous => ({
      ...previous,
      [category]: clampedValue,
    }))
  }

  function forgetMyData(): boolean {
    let storageRemoved = true

    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      storageRemoved = false
    }

    setFeedback({})
    setManualAdjustments({})
    setHistory([])

    setVisibleVideos(rankVideos(catalog, BASE_SCORES))

    setFeedVersion(version => version + 1)
    setCurrentIndex(0)
    activeIndexRef.current = 0

    setExplanationOpen(false)
    setAutoplayBlocked(false)

    setNotice(
      storageRemoved
        ? 'Your saved preferences and feedback have been cleared. Default recommendations restored.'
        : 'Preferences were reset for this session, but browser storage could not be cleared.',
    )

    return storageRemoved
  }

  function goToPreferences() {
    setCurrentIndex(0)
    activeIndexRef.current = 0
    setExplanationOpen(false)
    setAutoplayBlocked(false)
    setPage('preferences')
  }

  function goToFeed() {
    const updatedOrder = [...suggestedVideos]

    setVisibleVideos(updatedOrder)
    setFeedVersion(version => version + 1)

    setCurrentIndex(0)
    activeIndexRef.current = 0

    setExplanationOpen(false)
    setAutoplayBlocked(false)

    setNotice(
      `Preferences applied automatically. ` +
      `${updatedOrder[0].category} is now your top recommendation.`,
    )

    setPage('feed')
  }

  if (page === 'preferences') {
    return (
      <PreferenceControl
        scores={scores}
        onChange={updatePreference}
        onReset={() => setManualAdjustments({})}
        onClear={forgetMyData}
        onBack={goToFeed}
      />
    )
  }

  return (
    <div className="app">
      <main className="workspace">
        <section
          ref={feedPanelRef}
          className="feed-panel"
          aria-label="Short-video feed"
          style={{ position: 'relative' }}
        >
          <VerticalFeed
            key={feedVersion}
            items={visibleVideos}
            getItemKey={(item) => item.id ?? item.src}
            style={{
              height: '100%',
              width: '100%',
            }}
            onCurrentItemChange={handleVideoChange}
            onVideoError={handleVideoError}
            renderItemOverlay={(
              _item: VideoItem,
              index: number,
            ) => {
              const video = visibleVideos[index]

              if (!video) return null

              return (
                <div className="video-caption">
                  <span className="category">
                    {video.category}
                  </span>
                  <h2>{video.title}</h2>
                </div>
              )
            }}
            errorComponent={
              <div
                className="video-error"
                role="alert"
              >
                Video unavailable.
                Check your connection or try another clip.
              </div>
            }
          />

          {autoplayBlocked && (
            <div className="sound-gate">
              <div>
                <h2>Start watching with sound</h2>
                <p>
                  Your browser requires a click for
                  audible playback.
                </p>
                <button
                  type="button"
                  onClick={startWithSound}
                >
                  Start video ▶
                </button>
              </div>
            </div>
          )}
        </section>

        <aside
          className="info-panel"
          aria-label="Recommendation information"
        >
          <h1>Explore your feed</h1>

          <button
            type="button"
            className="preferences-hero-btn"
            onClick={goToPreferences}
          >
            <span
              className="preferences-hero-icon"
              aria-hidden="true"
            >
              ⚙
            </span>

            <span className="preferences-hero-text">
              <strong>My Preferences</strong>
              <small>
                View and adjust your interests
              </small>
            </span>

            <span
              className="preferences-hero-arrow"
              aria-hidden="true"
            >
              →
            </span>
          </button>

          <p className="intro">
            Like a video or mark it Not Interested.
            Your feedback updates a simulated preference
            model. You can also adjust your interests
            directly in My Preferences.
          </p>

          <div className="detail-row">
            <span>Currently viewing</span>
            <strong>{currentVideo.category}</strong>
          </div>

          <div className="detail-row">
            <span>Current interest score</span>
            <strong>{currentScore}/100</strong>
          </div>

          <section
            className="feedback-card"
            aria-label="User feedback"
          >
            <h2>Improve your recommendations</h2>

            <div className="feedback-actions">
              <button
                type="button"
                className={`feedback-btn ${
                  selectedReaction === 'like'
                    ? 'selected'
                    : ''
                }`}
                aria-pressed={
                  selectedReaction === 'like'
                }
                onClick={() =>
                  reactToCurrent('like')
                }
              >
                👍 Like
              </button>

              <button
                type="button"
                className={`feedback-btn ${
                  selectedReaction === 'notInterested'
                    ? 'selected'
                    : ''
                }`}
                aria-pressed={
                  selectedReaction === 'notInterested'
                }
                onClick={() =>
                  reactToCurrent('notInterested')
                }
              >
                👎 Not Interested
              </button>
            </div>

            <p
              className="feedback-note"
              role="status"
              aria-live="polite"
            >
              {notice}
            </p>

            <p className="feedback-rule">
              Simulated rules: Like +15 ·
              Not Interested −25 ·
              manual settings take priority ·
              scores 0–100.
            </p>
          </section>

          <button
            type="button"
            className="why-button"
            onClick={() =>
              setExplanationOpen(open => !open)
            }
            aria-expanded={explanationOpen}
            aria-controls="why-panel"
          >
            {explanationOpen
              ? 'Hide explanation'
              : 'Why this video?'}

            <span aria-hidden="true">
              {explanationOpen ? '−' : '+'}
            </span>
          </button>

          {explanationOpen && (
            <section
              className="why-panel"
              id="why-panel"
            >
              <h2>Why am I seeing this video?</h2>

              <p>
                This video belongs to the{' '}
                <strong>
                  {currentVideo.category}
                </strong>
                {' '}category. Its initial sample interest
                score was{' '}
                <strong>
                  {BASE_SCORES[currentVideo.category]}/100
                </strong>
                , and its current interest score is{' '}
                <strong>
                  {currentScore}/100
                </strong>.
              </p>

              <p>
                Your Likes, Not Interested feedback, and
                manual preference settings can influence
                this category's interest score.
              </p>

              {manualAdjustments[
                currentVideo.category
              ] !== undefined && (
                <p>
                  You have manually adjusted this
                  category's score in My Preferences.
                  Your manual setting takes priority
                  over automatic feedback adjustments
                  until you reset it.
                </p>
              )}

              <p>
                The current video order stays the same
                until you choose to apply the updated
                recommendations.
              </p>
            </section>
          )}

          <section
            className="rank-card"
            aria-label="New ranking preview"
          >
            <p className="status-label">
              NEXT FEED PREVIEW
            </p>

            <ol className="rank-list">
              {suggestedVideos
                .slice(0, 3)
                .map(video => (
                  <li key={video.id}>
                    <span>
                      {video.category}
                    </span>
                    <strong>
                      {scores[video.category]}/100
                    </strong>
                  </li>
                ))}
            </ol>

            <button
              type="button"
              className="apply-btn"
              onClick={applyNewOrder}
              disabled={!orderChanged}
            >
              {orderChanged
                ? 'Apply updated feed'
                : 'Feed order is up to date'}
            </button>

            <button
              type="button"
              className="undo-btn"
              onClick={undoLast}
              disabled={history.length === 0}
            >
              ↶ Undo last feedback
            </button>
          </section>
        </aside>
      </main>
    </div>
  )
}

export default App