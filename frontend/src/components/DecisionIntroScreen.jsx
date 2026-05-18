import { useEffect } from "react";

const DECISION_INTRO_DURATION_MS = 2000;

export function DecisionIntroScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, DECISION_INTRO_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <section className="screen screen--active showtime-screen" data-screen="decision-intro">
      <div className="showtime-stage showtime-stage--center decision-intro">
        <span className="eyebrow eyebrow--gold">Official ruling incoming</span>
        <h1 className="showtime-title showtime-title--accent">
          Decision <span className="title-accent">Time</span>
        </h1>
        <p className="showtime-sub">
          The arena holds for the final call from the judges.
        </p>
        <p className="decision-intro__status" role="status" aria-live="polite">
          <span className="tape-status__dots" aria-hidden="true">
            <span /><span /><span />
          </span>
          <span>Stand by for the official decision</span>
        </p>
      </div>
    </section>
  );
}
