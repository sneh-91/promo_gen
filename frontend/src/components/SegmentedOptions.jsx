export function SegmentedOptions({ name, options, value, columns = 3, onChange }) {
  return (
    <div
      className={columns === 4 ? "segmented segmented--4" : "segmented"}
      role="radiogroup"
    >
      {options.map((option) => (
        <label className="seg-option" key={option.value}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(name, option.value)}
            required
          />
          <span className={["seg-pill", option.className].filter(Boolean).join(" ")}>
            <span className="seg-title">{option.label}</span>
            <span className="seg-sub">{option.subLabel}</span>
          </span>
        </label>
      ))}
    </div>
  );
}
