import { useEffect, useState } from "react";

const WELCOME_DURATION_MS = 3000;

export function WelcomeScreen({ isResponseReady, onComplete }) {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), WELCOME_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (minTimeElapsed && isResponseReady) {
      onComplete();
    }
  }, [minTimeElapsed, isResponseReady, onComplete]);

  const showHoldMessage = minTimeElapsed && !isResponseReady;

  return (
    <section className="screen screen--active showtime-screen" data-screen="welcome">
      <div className="showtime-stage showtime-stage--center">
        <span className="eyebrow eyebrow--gold">Live from the arena</span>
        <h1 className="showtime-title">
          Welcome to <span className="title-accent">Fight Night</span>
        </h1>
        <p className="showtime-sub">The crowd is on their feet. The lights are coming up.</p>
        {showHoldMessage && (
          <p className="showtime-sub welcome-hold" role="status" aria-live="polite">
            <span className="tape-status__dots" aria-hidden="true">
              <span /><span /><span />
            </span>
            <span>Hang tight — the bookers are locking in your segment</span>
          </p>
        )}
      </div>
    </section>
  );
}
