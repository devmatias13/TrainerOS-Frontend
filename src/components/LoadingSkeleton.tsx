import './LoadingSkeleton.css'

interface LoadingSkeletonProps {
  /** Number of skeleton cards to show */
  count?: number
  /** Layout variant */
  variant?: 'card' | 'list' | 'stat'
}

export default function LoadingSkeleton({
  count = 3,
  variant = 'card',
}: LoadingSkeletonProps) {
  return (
    <div className={`skeleton-container skeleton-container--${variant}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton-item skeleton-item--${variant}`}>
          {variant === 'card' && (
            <>
              <div className="skeleton-line skeleton-line--title" />
              <div className="skeleton-line skeleton-line--text" />
              <div className="skeleton-line skeleton-line--text skeleton-line--short" />
            </>
          )}
          {variant === 'list' && (
            <>
              <div className="skeleton-avatar" />
              <div className="skeleton-body">
                <div className="skeleton-line skeleton-line--title" />
                <div className="skeleton-line skeleton-line--text skeleton-line--short" />
              </div>
            </>
          )}
          {variant === 'stat' && (
            <>
              <div className="skeleton-line skeleton-line--stat-value" />
              <div className="skeleton-line skeleton-line--text skeleton-line--short" />
            </>
          )}
        </div>
      ))}
    </div>
  )
}
