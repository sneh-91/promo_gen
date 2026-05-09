import {
  ALIGNMENT_BADGE_VARIANT,
  ALIGNMENT_LABELS,
  SIZE_LABELS,
} from "../constants";
import { ArrowIcon, MicIcon } from "./Icons";
import { Stepper } from "./Stepper";

function ReviewCard({ idx, wrestler, onEdit }) {
  const alignmentClass = wrestler.alignment
    ? `badge badge--${ALIGNMENT_BADGE_VARIANT[wrestler.alignment]}`
    : "badge";

  return (
    <article className="review-card" data-review={idx}>
      <header className="review-card__head">
        <span className="review-card__tag">
          <span className="tag-bar" />
          Contender {idx}
        </span>
        <button className="btn btn--small" type="button" onClick={() => onEdit(idx)}>
          Edit
        </button>
      </header>
      <h3 className="review-card__name">{wrestler.name || "—"}</h3>
      <div className="review-card__meta">
        <span className={alignmentClass}>
          {ALIGNMENT_LABELS[wrestler.alignment] || "—"}
        </span>
        <span className="badge badge--muted">
          {SIZE_LABELS[wrestler.size] || "—"}
        </span>
      </div>
      <div className="review-card__section">
        <span className="review-card__label">Look</span>
        <p className="review-card__text">{wrestler.look || "—"}</p>
      </div>
      <div className="review-card__section">
        <span className="review-card__label">Description</span>
        <p className="review-card__text">{wrestler.description || "—"}</p>
      </div>
    </article>
  );
}

export function ReviewScreen({
  confirmLabel,
  firstOnMic,
  isSubmitting,
  wrestlers,
  onBack,
  onConfirm,
  onEdit,
  onFirstOnMicChange,
}) {
  return (
    <section className="screen screen--active" data-screen="review">
      <div className="container container--wide">
        <Stepper screen="review" activeWrestler={2} />

        <header className="page-head">
          <span className="eyebrow eyebrow--gold">Final Card</span>
          <h2 className="page-title">
            Tale of the <span className="title-accent">Tape</span>
          </h2>
          <p className="page-sub">
            Review the matchup card before sending both wrestlers to the microphone.
          </p>
        </header>

        <div className="review-grid">
          <ReviewCard idx={1} wrestler={wrestlers[1]} onEdit={onEdit} />

          <div className="vs-wrap" aria-hidden="true">
            <span className="vs-text">VS</span>
          </div>

          <ReviewCard idx={2} wrestler={wrestlers[2]} onEdit={onEdit} />
        </div>

        <div className="mic-pick" role="radiogroup" aria-label="Who's on the mic first">
          <span className="mic-pick__label">On the mic first</span>
          <div className="mic-pick__toggle">
            {[1, 2].map((idx) => (
              <label
                className="mic-opt"
                aria-label={`Contender ${idx} on the mic first`}
                key={idx}
              >
                <input
                  type="radio"
                  name="first-on-mic"
                  value={idx}
                  checked={firstOnMic === idx}
                  onChange={() => onFirstOnMicChange(idx)}
                />
                <span className="mic-arrow">
                  <ArrowIcon direction={idx === 1 ? "left" : "right"} />
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="actions actions--center">
          <button className="btn btn--ghost" type="button" onClick={onBack}>
            <ArrowIcon direction="left" className="icon-arrow icon-arrow--left" />
            <span>Back</span>
          </button>
          <button
            className="btn btn--primary btn--confirm"
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            <MicIcon />
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
