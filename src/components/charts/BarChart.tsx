export type ChartDatum = {
  label: string;
  value: number;
};

type BarChartProps = {
  data: ChartDatum[];
  formatValue: (value: number) => string;
  ariaLabel: string;
};

// Horizontal bars. Pure CSS: the bar width is value / max.
function BarChart({ data, formatValue, ariaLabel }: BarChartProps) {
  let max = 0;
  for (const datum of data) if (datum.value > max) max = datum.value;

  return (
    <ul className="hbar-list" aria-label={ariaLabel}>
      {data.map((datum) => (
        <li key={datum.label} className="hbar-row">
          <span className="bar-label">{datum.label}</span>
          <span className="bar-track" aria-hidden="true">
            <span
              className="bar-fill"
              style={{ width: max === 0 ? "0%" : `${(datum.value / max) * 100}%` }}
            />
          </span>
          <span className="hbar-value">{formatValue(datum.value)}</span>
        </li>
      ))}
    </ul>
  );
}

export default BarChart;