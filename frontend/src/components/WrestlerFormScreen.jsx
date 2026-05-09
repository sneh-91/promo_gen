import { useEffect, useRef } from "react";

import {
  ALIGNMENT_OPTIONS,
  FIELD_LIMITS,
  SIZE_OPTIONS,
} from "../constants";
import { ArrowIcon } from "./Icons";
import { FieldCounter } from "./FieldCounter";
import { SegmentedOptions } from "./SegmentedOptions";
import { Stepper } from "./Stepper";

export function WrestlerFormScreen({
  activeWrestler,
  errors,
  wrestler,
  onBack,
  onChange,
  onSubmit,
}) {
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, [activeWrestler]);

  const updateField = (field, value) => {
    onChange(activeWrestler, field, value);
  };

  return (
    <section className="screen screen--active" data-screen="wrestler">
      <div className="container">
        <Stepper screen="wrestler" activeWrestler={activeWrestler} />

        <header className="page-head">
          <span className="eyebrow">Contender {activeWrestler} of 2</span>
          <h2 className="page-title">
            Meet <span className="title-accent">Contender {activeWrestler}</span>
          </h2>
          <p className="page-sub">
            Give the creative team enough heat, style, and swagger to book the segment.
          </p>
        </header>

        <form className="form" noValidate onSubmit={onSubmit}>
          <div className={errors.name ? "field has-error" : "field"}>
            <label className="label" htmlFor="name">Name</label>
            <input
              ref={nameRef}
              className="input"
              type="text"
              id="name"
              name="name"
              placeholder="e.g. Stone Cold Steve Austin"
              autoComplete="off"
              maxLength={FIELD_LIMITS.name}
              value={wrestler.name}
              onChange={(event) => updateField("name", event.target.value)}
              required
            />
            <FieldCounter field="name" value={wrestler.name} />
          </div>

          <div className={errors.alignment ? "field has-error" : "field"}>
            <span className="label">Alignment</span>
            <SegmentedOptions
              name="alignment"
              options={ALIGNMENT_OPTIONS}
              value={wrestler.alignment}
              onChange={updateField}
            />
          </div>

          <div className={errors.size ? "field has-error" : "field"}>
            <span className="label">Size</span>
            <SegmentedOptions
              name="size"
              options={SIZE_OPTIONS}
              value={wrestler.size}
              columns={4}
              onChange={updateField}
            />
          </div>

          <div className={errors.look ? "field has-error" : "field"}>
            <label className="label" htmlFor="look">Look</label>
            <textarea
              className="input textarea textarea--sm"
              id="look"
              name="look"
              rows="3"
              placeholder="Attire, hair, tattoos, physique, ring entrance vibe..."
              maxLength={FIELD_LIMITS.look}
              value={wrestler.look}
              onChange={(event) => updateField("look", event.target.value)}
              required
            />
            <FieldCounter field="look" value={wrestler.look} />
          </div>

          <div className={errors.description ? "field has-error" : "field"}>
            <label className="label" htmlFor="description">Description</label>
            <textarea
              className="input textarea"
              id="description"
              name="description"
              rows="5"
              placeholder="Backstory, gimmick, motivations, signature moves, mic style..."
              maxLength={FIELD_LIMITS.description}
              value={wrestler.description}
              onChange={(event) => updateField("description", event.target.value)}
              required
            />
            <FieldCounter field="description" value={wrestler.description} />
          </div>

          <div className="actions">
            <button className="btn btn--ghost" type="button" onClick={onBack}>
              <ArrowIcon direction="left" className="icon-arrow icon-arrow--left" />
              <span>Back</span>
            </button>
            <button className="btn btn--next" type="submit">
              <span>{activeWrestler === 1 ? "Next Up" : "Lock It In"}</span>
              <ArrowIcon className="icon-arrow" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
