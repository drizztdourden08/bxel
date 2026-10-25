/* @layer renderer-app @kind types */
type A11yFinding = {
  readonly rule: string;
  readonly impact: string;
  readonly help: string;
  readonly targets: readonly string[];
};

type A11yGap = {
  readonly rule: string;
  readonly target: string;
  readonly owner: string;
  readonly why: string;
};

export type { A11yFinding, A11yGap };
