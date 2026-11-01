/* @layer renderer-app @kind types */
import type { CommandStep } from '@bxel/document';

interface Look {
  rgb: string;
  alpha: number;
}

interface RecolourChange {
  title: string;
  note: string;
  label: string;
  done: string;
  steps: readonly CommandStep[];
  after: readonly string[];
}

export type { Look, RecolourChange };
