/* @layer renderer-app @kind types */

interface LoopSpan {
  from: number;
  to: number;
}

interface LoopBand {
  valid: LoopSpan | null;
  band: LoopSpan | null;
  start: number;
  end: number;
}

export type { LoopBand, LoopSpan };
