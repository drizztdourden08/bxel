/* @layer renderer-app @kind types */
type HiddenColumnsState = {
  readonly hidden: readonly string[];
  readonly toggle: (column: string) => void;
};

export type { HiddenColumnsState };
