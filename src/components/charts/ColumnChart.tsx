import type { ChartDatum } from "./BarChart";

type ColumnChartProps = {
  data: ChartDatum[];
  formatValue: (value: number) => string;
  ariaLabel: string;
};

const MIN_COLUMN_WIDTH = 44; // px; narrower charts scroll sideways instead of cramming labels

// Vertical columns. Pure CSS: the column height is value / max of the track.
function ColumnChart({ data, formatValue, ariaLabel }: ColumnChartProps) {
  let max = 0;
  for (const datum of data) if (datum.value > max) max = datum.value;

  // role="img" hides the children from screen readers, so the label carries the data
  const summary = `${ariaLabel}: ${data
    .map((datum) => `${datum.label} ${formatValue(datum.value)}`)
    .join(", ")}`;

  return (
    <div className="columns-scroll">
      <div
        className="columns"
        role="img"
        aria-label={summary}
        style={{ minWidth: data.length * MIN_COLUMN_WIDTH }}
      >
        {data.map((datum) => (
          <div key={datum.label} className="column" title={`${datum.label}: ${formatValue(datum.value)}`}>
            <div className="column-track">
              <div
                className="column-fill"
                style={{ height: max === 0 ? "0%" : `${(datum.value / max) * 100}%` }}
              >
                <span className="column-value">{formatValue(datum.value)}</span>
              </div>
            </div>
            <span className="column-label">{datum.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ColumnChart;