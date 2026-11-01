/* @layer core @kind types */
type LintRule = 'orphan' | 'double' | 'banding';

interface LintFinding {
  readonly rule: LintRule;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly index: number;
}

interface LintInput {
  readonly pixels: Uint8Array;
  readonly width: number;
  readonly height: number;
  readonly rules?: readonly LintRule[];
  readonly limit?: number;
}

interface LintResult {
  readonly findings: readonly LintFinding[];
  readonly total: number;
}

export type { LintFinding, LintInput, LintResult, LintRule };
