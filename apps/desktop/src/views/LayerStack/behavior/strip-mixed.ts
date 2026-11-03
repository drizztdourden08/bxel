/* @layer renderer-app @kind logic */
import type { LayerRowModel, StripMixed } from '../LayerStack.type';

const differs = <T>(rows: readonly LayerRowModel[], read: (row: LayerRowModel) => T): boolean => new Set(rows.map(read)).size > 1;

const stripMixed = (chosen: readonly LayerRowModel[]): StripMixed => ({
  lock: differs(chosen, (row) => row.lock),
  opacity: differs(chosen, (row) => row.viewOpacity),
  clip: differs(chosen.filter((row) => row.kind === 'pixel'), (row) => row.clip),
  exported: differs(chosen.filter((row) => row.kind !== 'reference'), (row) => row.exported),
});

export { stripMixed };
