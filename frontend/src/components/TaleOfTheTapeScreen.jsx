import { useEffect } from "react";

import { ALIGNMENT_LABELS, SIZE_LABELS } from "../constants";
import { WrestlerAvatar } from "./WrestlerAvatar";

const MIN_DISPLAY_MS = 5000;

export function TaleOfTheTapeScreen({ wrestlers, firstOnMic, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, MIN_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <section className="screen screen--active showtime-screen" data-screen="tale-of-tape">
      <div className="container container--wide">
        <header className="page-head">
          <span className="eyebrow eyebrow--gold">Tale of the Tape</span>
          <h2 className="page-title">
            Tonight's <span className="title-accent">Main Event</span>
          </h2>
        </header>

        <div className="tape-grid">
          <TapeSide wrestler={wrestlers[1]} idx={1} isFirst={firstOnMic === 1} />

          <div className="vs-wrap" aria-hidden="true">
            <span className="vs-text">VS</span>
          </div>

          <TapeSide wrestler={wrestlers[2]} idx={2} isFirst={firstOnMic === 2} />
        </div>
      </div>
    </section>
  );
}

function TapeSide({ wrestler, idx, isFirst }) {
  return (
    <article className="tape-side" data-tape-side={idx}>
      <div className="tape-avatar-wrap">
        <WrestlerAvatar wrestler={wrestler} className="tape-avatar" />
      </div>
      <h3 className="tape-name">{wrestler.name || "—"}</h3>
      <div className="tape-meta">
        <span className="tape-meta__item">{ALIGNMENT_LABELS[wrestler.alignment] || "—"}</span>
        <span className="tape-meta__sep" aria-hidden="true">·</span>
        <span className="tape-meta__item">{SIZE_LABELS[wrestler.size] || "—"}</span>
      </div>
      {isFirst && <span className="tape-mic-flag">First on the mic</span>}
    </article>
  );
}
