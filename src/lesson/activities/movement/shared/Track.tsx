export function Track({ distance }: { distance: number }) {
  return (
    <div className="w-full py-6">
      <div
        className="relative mx-4 h-16 border-b-2 border-line"
        role="img"
        aria-label={`출발점에서 ${distance}미터 이동`}
      >
        <div
          className="absolute bottom-0 left-0 h-1 bg-teal"
          style={{ width: `${(distance / 24) * 100}%` }}
        />
        <div
          className="absolute bottom-0 size-6 -translate-x-1/2 translate-y-1/2 rounded-full border-4 border-surface bg-teal shadow-sm"
          style={{ left: `${(distance / 24) * 100}%` }}
        />
      </div>
      <div className="mx-4 mt-6 flex justify-between text-sm text-muted">
        <span>0 m</span>
        <span>12 m</span>
        <span>24 m</span>
      </div>
      <p className="mt-8 text-center text-3xl font-bold text-teal canvas:text-5xl">{distance} m</p>
    </div>
  );
}
