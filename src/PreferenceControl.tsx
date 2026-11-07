import { useState } from 'react'
import type { Category } from './recommendation'

type PreferenceControlProps = {
  scores: Record<Category, number>
  onChange: (category: Category, value: number) => void
  onReset: () => void
  onClear: () => boolean
  onBack: () => void
}

const categories: { name: Category; emoji: string }[] = [
  { name: 'Food', emoji: '🍜' },
  { name: 'Nature', emoji: '🏞️' },
  { name: 'Animals', emoji: '🐱' },
  { name: 'Fun', emoji: '🎡' },
  { name: 'Travel', emoji: '✈️' },
  { name: 'Sports', emoji: '🏀' },
  { name: 'Music', emoji: '🎵' },
  { name: 'City', emoji: '🌆' },
]

export default function PreferenceControl({
  scores,
  onChange,
  onReset,
  onClear,
  onBack,
}: PreferenceControlProps) {
  const [showConfirmation, setShowConfirmation] =
    useState(false)

  const [clearMessage, setClearMessage] =
    useState('')

  function confirmClear() {
    const cleared = onClear()

    setShowConfirmation(false)

    setClearMessage(
      cleared
        ? 'Your saved preferences and feedback have been deleted. All categories have returned to their default scores.'
        : 'Preferences were reset for this session, but saved browser data could not be deleted. Check your browser storage settings.',
    )
  }

  return (
    <div className="preferences-page">
      <main className="preferences-content">
        <button
          type="button"
          className="preferences-back"
          onClick={onBack}
        >
          ← Back to feed
        </button>

        <h1>My Preferences</h1>

        <p className="intro">
          Inspect and edit the interest scores used by
          your recommendation feed.
        </p>

        <p className="intro">
          Higher scores mean that videos in this category
          will appear earlier in the next recommendation ranking.
        </p>

        <section
          className="preferences-list"
          aria-label="Editable interest preferences"
        >
          {categories.map(({ name, emoji }) => (
            <div
              className="preference-item"
              key={name}
            >
              <div className="preference-heading">
                <label htmlFor={`interest-${name}`}>
                  {emoji} {name}
                </label>

                <strong>
                  {scores[name]}/100
                </strong>
              </div>

              <input
                id={`interest-${name}`}
                type="range"
                min="0"
                max="100"
                step="1"
                value={scores[name]}
                onChange={(event) => {
                  setClearMessage('')

                  onChange(
                    name,
                    Number(event.target.value),
                  )
                }}
              />
            </div>
          ))}
        </section>

        <button
          type="button"
          className="reset-preferences"
          onClick={() => {
            setClearMessage('')
            onReset()
          }}
        >
          ↺ Reset manual adjustments
        </button>

        <p className="disclaimer">
          Manual changes are applied automatically
          when you return to the feed.
          Reset manual adjustments only removes
          slider overrides; it does not remove
          your Likes or Not Interested feedback.
        </p>

        <section
          className="data-control-card"
          aria-label="Manage saved data"
        >
          <h2>Manage your data</h2>

          <p>
            This browser can remember your Likes,
            Not Interested feedback and manual
            interest scores. You can erase all of
            this prototype's saved recommendation data.
          </p>

          {!showConfirmation ? (
            <button
              type="button"
              className="forget-data-btn"
              onClick={() => {
                setClearMessage('')
                setShowConfirmation(true)
              }}
            >
              Forget My Data
            </button>
          ) : (
            <div
              className="clear-confirmation"
              role="group"
              aria-labelledby="clear-confirmation-title"
            >
              <h3 id="clear-confirmation-title">
                Delete all your saved recommendation data?
              </h3>

              <p>
                This will remove Likes, Not Interested
                feedback and manual scores, and restore
                the default ranking. This action cannot
                be undone.
              </p>

              <div className="clear-confirmation-actions">
                <button
                  type="button"
                  className="clear-cancel-btn"
                  onClick={() =>
                    setShowConfirmation(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="clear-confirm-btn"
                  onClick={confirmClear}
                >
                  Yes, clear my data
                </button>
              </div>
            </div>
          )}

          {clearMessage && (
            <p
              className="clear-result"
              role="status"
              aria-live="polite"
            >
              {clearMessage}
            </p>
          )}
        </section>
      </main>
    </div>
  )
}