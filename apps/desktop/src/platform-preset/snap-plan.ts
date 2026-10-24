/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import type { PlatformPreset } from '@bxel/presets';
import { bankSnap } from './bank-snap';
import type { SnapChange, SnapPlan } from './snap-plan.type';

const snapPlan = (artwork: Artwork, preset: PlatformPreset): SnapPlan => {
  const changes: SnapChange[] = [];
  const skipped: string[] = [];
  for (const bank of artwork.banks) {
    const found = bankSnap(preset, bank);
    if (found === null) skipped.push(bank.name);
    else changes.push(...found);
  }
  return { changes, skipped };
};

export { snapPlan };
