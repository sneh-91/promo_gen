import { useEffect, useState } from "react";

import { ALIGNMENT_LABELS, SIZE_LABELS } from "../constants";
import { WrestlerAvatar } from "./WrestlerAvatar";

const MIN_DISPLAY_MS = 5000;

export function TaleOfTheTapeScreen({ wrestlers, firstOnMic, isResponseReady, onComplete }) {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (minTimeElapsed && isResponseReady) {
      onComplete();
    }
  }, [minTimeElapsed, isResponseReady, onComplete]);

  const isWaiting = !isResponseReady;

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
          <TapeSide
            wrestler={wrestlers[1]}
            idx={1}
            isFirst={firstOnMic === 1}
            isWaiting={isWaiting}
          />

          <div className="vs-wrap" aria-hidden="true">
            <span className="vs-text">VS</span>
          </div>

          <TapeSide
            wrestler={wrestlers[2]}
            idx={2}
            isFirst={firstOnMic === 2}
            isWaiting={isWaiting}
          />
        </div>

        {isWaiting && (
          <p className="tape-status" role="status" aria-live="polite">
            <span className="tape-status__dots" aria-hidden="true">
              <span /><span /><span />
            </span>
            <span>Bookers are putting the finishing touches on the segment</span>
          </p>
        )}
      </div>
    </section>
  );
}

function TapeSide({ wrestler, idx, isFirst, isWaiting }) {
  const sideClass = `tape-side${isWaiting ? " tape-side--waiting" : ""}`;

  return (
    <article className={sideClass} data-tape-side={idx}>
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
