/* @layer renderer-app @kind types */
import type { CommandStep } from '@bxel/document';
import type { SourceColor } from '../palette-source/palette-source.type';

type ImportMode = 'append' | 'replace' | 'map';

interface ImportSource {
  name: string;
  colors: readonly SourceColor[];
}

interface ImportPlan {
  mode: ImportMode;
  kept: readonly SourceColor[];
  present: readonly SourceColor[];
  over: readonly SourceColor[];
  steps: readonly CommandStep[];
  label: string;
  done: string;
  apply: string;
}

export type { ImportMode, ImportPlan, ImportSource };
