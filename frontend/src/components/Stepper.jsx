import { Fragment } from "react";

const steps = [
  { id: 1, label: "Contender 1" },
  { id: 2, label: "Contender 2" },
  { id: "review", label: "Face-Off" },
];

function getStepClass(stepId, screen, activeWrestler) {
  if (screen === "review") {
    return stepId === "review" ? "step is-active" : "step is-done";
  }

  if (screen === "wrestler") {
    if (stepId === activeWrestler) return "step is-active";
    if (typeof stepId === "number" && stepId < activeWrestler) return "step is-done";
  }

  return "step";
}

export function Stepper({ screen, activeWrestler }) {
  return (
    <nav className="stepper" aria-label="Progress">
      {steps.map((step, index) => (
        <Fragment key={step.id}>
          <div className={getStepClass(step.id, screen, activeWrestler)}>
            <span className="step-num">{index + 1}</span>
            <span className="step-label">{step.label}</span>
          </div>
          {index < steps.length - 1 && <div className="step-line" />}
        </Fragment>
      ))}
    </nav>
  );
}
