import { create } from "zustand";
import { persist } from "zustand/middleware";

export const DATASET_SIZES = [1_000, 10_000, 100_000] as const;
export type DatasetSize = (typeof DATASET_SIZES)[number];

export type RowDensity = "comfortable" | "compact";

export const DENSITY_ROW_HEIGHT: Record<RowDensity, number> = {
  comfortable: 56,
  compact: 40,
};

type SettingsState = {
  datasetSize: DatasetSize;
  density: RowDensity;
  setDatasetSize: (size: DatasetSize) => void;
  setDensity: (density: RowDensity) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      datasetSize: 1_000,
      density: "comfortable",
      setDatasetSize: (datasetSize) => set({ datasetSize }),
      setDensity: (density) => set({ density }),
    }),
    {
      name: "gridforge-settings",
      version: 1,
      partialize: (state) => ({ datasetSize: state.datasetSize, density: state.density }),

      // Never trust localStorage: it can be edited, or written by an older version of the app.
      // Anything that isn't a known option falls back to the default, so a value like
      // datasetSize: 999999999 can never freeze the page on load.
      merge: (persisted, current) => {
        const saved = persisted as Partial<Pick<SettingsState, "datasetSize" | "density">> | undefined;
        return {
          ...current,
          datasetSize: DATASET_SIZES.find((size) => size === saved?.datasetSize) ?? current.datasetSize,
          density:
            saved?.density === "comfortable" || saved?.density === "compact"
              ? saved.density
              : current.density,
        };
      },
    },
  ),
);