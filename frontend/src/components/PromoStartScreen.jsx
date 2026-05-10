import { useEffect } from "react";

const PROMO_START_DURATION_MS = 2000;

export function PromoStartScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, PROMO_START_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <section className="screen screen--active showtime-screen" data-screen="promo-start">
      <div className="showtime-stage showtime-stage--center">
        <h1 className="showtime-title showtime-title--accent">
          Promo Starts <span className="title-accent">Now</span>
        </h1>
      </div>
    </section>
  );
}
