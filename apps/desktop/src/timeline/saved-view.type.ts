/* @layer renderer-app @kind types */
import type { TimeUnits } from '../stores/timeline-store.type';

interface SavedView {
  zooms: Readonly<Record<string, number>>;
  timeMode: boolean;
  units: TimeUnits;
}

export type { SavedView };
