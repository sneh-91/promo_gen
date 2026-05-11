import { ArrowIcon } from "./Icons";
import { WrestlerAvatar } from "./WrestlerAvatar";

function formatScore(score) {
  return Number(score).toFixed(1);
}

export function VerdictScreen({ isJudgePending, judgeResult, wrestlers, onRestart }) {
  if (isJudgePending) {
    return (
      <section className="screen screen--active showtime-screen" data-screen="verdict">
        <div className="showtime-stage showtime-stage--center">
          <span className="eyebrow eyebrow--gold">The judges confer</span>
          <h1 className="showtime-title showtime-title--end">
            Decision <span className="title-accent">Pending</span>
          </h1>
          <p className="showtime-sub">
            The scorecards are still coming in. Hold for the official decision.
          </p>
        </div>
      </section>
    );
  }

  if (!judgeResult) {
    return (
      <section className="screen screen--active showtime-screen" data-screen="verdict">
        <div className="showtime-stage showtime-stage--center">
          <span className="eyebrow eyebrow--gold">Decision unavailable</span>
          <h1 className="showtime-title showtime-title--end">
            No <span className="title-accent">Verdict</span>
          </h1>
          <p className="showtime-sub">
            The judges failed to submit a scorecard, but the segment is complete.
          </p>
          <button className="btn btn--primary btn--chunky" type="button" onClick={onRestart}>
            <span>Cut Another Promo</span>
            <ArrowIcon className="icon-arrow" />
          </button>
        </div>
      </section>
    );
  }

  const winner = wrestlers[judgeResult.winner_index];
  const scoresByName = new Map(
    judgeResult.scores.map((score) => [score.wrestler_name, score.score])
  );

  return (
    <section className="screen screen--active showtime-screen" data-screen="verdict">
      <div className="container container--wide verdict-stage">
        <header className="page-head">
          <span className="eyebrow eyebrow--gold">The judges have reached a decision</span>
          <h2 className="page-title">
            Winner <span className="title-accent">Declared</span>
          </h2>
        </header>

        <section className="verdict-hero">
          <div className="verdict-hero__avatar">
            <WrestlerAvatar wrestler={winner} className="verdict-avatar" />
          </div>
          <div className="verdict-hero__copy">
            <p className="verdict-kicker">{judgeResult.summary_line}</p>
            <h1 className="verdict-name">{judgeResult.winner_name}</h1>
            <p className="verdict-reason">{judgeResult.reason}</p>
          </div>
        </section>

        <section className="verdict-scores" aria-label="Promo scores">
          {[wrestlers[1], wrestlers[2]].map((wrestler, index) => {
            const wrestlerIndex = index + 1;
            const isWinner = wrestlerIndex === judgeResult.winner_index;
            const score = scoresByName.get(wrestler.name) ?? 0;

            return (
              <article
                key={wrestlerIndex}
                className={isWinner ? "verdict-score is-winner" : "verdict-score"}
              >
                <span className="verdict-score__label">Contender {wrestlerIndex}</span>
                <h3 className="verdict-score__name">{wrestler.name}</h3>
                <p className="verdict-score__value">{formatScore(score)}</p>
              </article>
            );
          })}
        </section>

        <div className="actions actions--center">
          <button className="btn btn--primary btn--chunky" type="button" onClick={onRestart}>
            <span>Cut Another Promo</span>
            <ArrowIcon className="icon-arrow" />
          </button>
        </div>
      </div>
    </section>
  );
}
