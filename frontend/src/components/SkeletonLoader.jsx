export default function SkeletonLoader({ type = 'card' }) {
  if (type === 'card') {
    return (
      <div className="surface-panel rounded-xl shadow-md p-6 animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-bg/60 rounded-full"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-bg/60 rounded w-3/4"></div>
            <div className="h-3 bg-bg rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="surface-panel rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-bg/60 rounded w-full mb-2"></div>
            <div className="h-3 bg-bg rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return null
}
