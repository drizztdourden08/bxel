/* @layer renderer-app @kind types */
interface SnapChange {
  bankId: string;
  bankName: string;
  swatchId: string;
  index: number;
  before: string;
  after: string;
  rename: boolean;
}

interface SnapPlan {
  changes: readonly SnapChange[];
  skipped: readonly string[];
}

type SnapOutcome = { ok: true; moved: number } | { ok: false; message: string };

interface SnapScope {
  platformId?: string;
  bankIds?: ReadonlySet<string>;
}

export type { SnapChange, SnapOutcome, SnapPlan, SnapScope };
