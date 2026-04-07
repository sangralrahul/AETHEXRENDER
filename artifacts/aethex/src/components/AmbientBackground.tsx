export function AmbientBackground() {
  return (
    <div className="aethex-ambient" aria-hidden="true">
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />
      <div className="ambient-orb orb-4" />
      <div className="ambient-particles">
        {Array.from({ length: 28 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${(i * 37 + 11) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              animationDelay: `${(i * 0.7) % 9}s`,
              animationDuration: `${8 + (i % 6)}s`,
              width: i % 5 === 0 ? 2 : 1,
              height: i % 5 === 0 ? 2 : 1,
            }}
          />
        ))}
      </div>
      <div className="ambient-grain" />
    </div>
  );
}
