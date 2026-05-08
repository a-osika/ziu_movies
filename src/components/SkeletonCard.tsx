export function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-img shimmer" />

      <div className="skeleton-title shimmer" />

      <div className="skeleton-meta shimmer" />
    </div>
  );
}

// CSS shimmer animation:
// @keyframes shimmer {
//   from { background-position: -200% 0; }
//   to   { background-position:  200% 0; }
// }
// .shimmer {
//   background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
//   background-size: 200% 100%;
//   animation: shimmer 1.5s infinite;
// }