import { useEmployeeStore } from "../features/employees/employee.store";
import {
  DATASET_SIZES,
  DENSITY_ROW_HEIGHT,
  useSettingsStore,
  type DatasetSize,
  type RowDensity,
} from "../features/settings/settings.store";

const DENSITIES: { key: RowDensity; label: string }[] = [
  { key: "comfortable", label: "Comfortable" },
  { key: "compact", label: "Compact" },
];

function SettingsPage() {
  const datasetSize = useSettingsStore((state) => state.datasetSize);
  const density = useSettingsStore((state) => state.density);
  const setDensity = useSettingsStore((state) => state.setDensity);

  const employeeCount = useEmployeeStore((state) => state.employees.length);
  const generationMs = useEmployeeStore((state) => state.generationMs);
  const loadDataset = useEmployeeStore((state) => state.loadDataset);

  // More employees than the dataset size means the user added some by hand
  const hasAddedEmployees = employeeCount > datasetSize;

  function replaceData(size: DatasetSize) {
    if (
      hasAddedEmployees &&
      !window.confirm("This replaces all current data, including employees you added. Continue?")
    ) {
      return;
    }
    loadDataset(size);
  }

  return (
    <>
      <title>Settings · GridForge</title>

      <section className="page-header">
        <div>
          <p className="page-eyebrow">Workspace / Settings</p>
          <h1 className="page-title">Settings</h1>
          <p className="page-description">Dataset size and display preferences.</p>
        </div>
      </section>

      <div className="settings-stack">
        <section className="panel" aria-labelledby="dataset-title">
          <div className="setting-row">
            <div className="setting-text">
              <h2 className="panel-title" id="dataset-title">
                Dataset size
              </h2>
              <p className="setting-description">
                How many employees to generate. Try 100,000: the grid still renders only a few
                dozen rows at a time.
              </p>
            </div>
            <div className="segmented" role="group" aria-labelledby="dataset-title">
              {DATASET_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`segmented-button${datasetSize === size ? " is-selected" : ""}`}
                  aria-pressed={datasetSize === size}
                  onClick={() => {
                    if (size !== datasetSize) replaceData(size);
                  }}
                >
                  {size.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="setting-row">
            <div className="setting-text">
              <h2 className="panel-title">Reset data</h2>
              <p className="setting-description">
                Regenerates the dataset and clears search, filters and sort. Employees you added
                are discarded.
              </p>
            </div>
            <button type="button" className="toolbar-button" onClick={() => replaceData(datasetSize)}>
              Reset data
            </button>
          </div>

          <p className="setting-stat" aria-live="polite">
            {employeeCount.toLocaleString()} employees in memory · generated in{" "}
            {Math.max(1, Math.round(generationMs))} ms
          </p>
        </section>

        <section className="panel" aria-labelledby="density-title">
          <div className="setting-row">
            <div className="setting-text">
              <h2 className="panel-title" id="density-title">
                Row density
              </h2>
              <p className="setting-description">
                Comfortable rows are {DENSITY_ROW_HEIGHT.comfortable}px tall, compact rows are{" "}
                {DENSITY_ROW_HEIGHT.compact}px, which fits about 40% more rows on screen.
              </p>
            </div>
            <div className="segmented" role="group" aria-labelledby="density-title">
              {DENSITIES.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`segmented-button${density === item.key ? " is-selected" : ""}`}
                  aria-pressed={density === item.key}
                  onClick={() => setDensity(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default SettingsPage;