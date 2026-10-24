/* @layer renderer-app @kind types */
import type { Sprite } from '@bxel/document';

interface BankMerges {
  colours: number;
  merged: number;
}

interface BankPlan extends BankMerges {
  movers: readonly Sprite[];
  skipped: number;
  blocker: string | null;
}

export type { BankMerges, BankPlan };
