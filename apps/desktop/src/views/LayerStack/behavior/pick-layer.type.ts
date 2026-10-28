/* @layer renderer-app @kind types */
type PickHow = 'replace' | 'toggle' | 'range';

interface PickState {
  order: readonly string[];
  selected: readonly string[];
  anchor: string | null;
  active: string | null;
}

interface PickResult {
  selected: readonly string[];
  anchor: string | null;
  active: string | null;
}

export type { PickHow, PickResult, PickState };
