import { useState } from "react";
import { RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

interface FlashCardProps {
  cards: { front: string; back: string }[];
}

export function FlashCard({ cards }: FlashCardProps) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const next = () => { setCurrent(i => Math.min(i + 1, cards.length - 1)); setFlipped(false); };
  const prev = () => { setCurrent(i => Math.max(i - 1, 0)); setFlipped(false); };

  const card = cards[current];

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm" style={{ color: "#8B949E" }}>
        <span>{current + 1} / {cards.length} cards</span>
        <span style={{ color: "#00C2A8" }}>Click card to flip</span>
      </div>

      {/* Card */}
      <div
        className="relative w-full rounded-2xl border cursor-pointer select-none transition-all duration-300"
        style={{ background: "#161B22", borderColor: flipped ? "#00C2A8" : "#21262D", minHeight: 220 }}
        onClick={() => setFlipped(f => !f)}
      >
        <div className="absolute top-4 right-4">
          <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: flipped ? "rgba(0,194,168,0.15)" : "rgba(139,148,158,0.15)", color: flipped ? "#00C2A8" : "#8B949E" }}>
            {flipped ? "Answer" : "Question"}
          </span>
        </div>
        <div className="flex items-center justify-center p-8 min-h-[220px]">
          <p className="text-center leading-relaxed font-medium text-base" style={{ color: "#E6EDF3" }}>
            {flipped ? card.back : card.front}
          </p>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <RotateCcw className="w-4 h-4" style={{ color: "#8B949E" }} />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={prev} disabled={current === 0}
          className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
          style={{ background: "#21262D", color: "#E6EDF3" }}>
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>
        <div className="flex gap-1">
          {cards.map((_, i) => (
            <button key={i} onClick={() => { setCurrent(i); setFlipped(false); }}
              className="w-2 h-2 rounded-full transition-all"
              style={{ background: i === current ? "#00C2A8" : "#21262D" }} />
          ))}
        </div>
        <button onClick={next} disabled={current === cards.length - 1}
          className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
          style={{ background: "#21262D", color: "#E6EDF3" }}>
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
