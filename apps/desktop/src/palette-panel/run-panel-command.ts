/* @layer renderer-app @kind logic */
import { announce, toast } from '@drizztdourden08/brock-react';
import { currentTarget } from '../editor/current-target';
import { makeRamp } from '../palette-ramps/make-ramp';
import { usePaletteSheetStore } from '../stores/usePaletteSheetStore';
import { useRampBuilderStore } from '../stores/useRampBuilderStore';
import { useToolStore } from '../stores/useToolStore';
import { addSwatch } from './add-swatch';
import { nudgedColour } from './nudged-colour';
import type { CommandScene, PanelCommand, PanelOutcome } from './palette-panel.type';
import { selectedIndices } from './selected-indices';
import { sortSwatches } from './sort-swatches';

const report = (outcome: PanelOutcome): void => {
  if (!outcome.ok) toast(outcome.message, { variant: 'danger' });
  else if (outcome.message !== '') announce(outcome.message);
};

const sheet = (scene: CommandScene, kind: 'gradient' | 'unused' | 'duplicates'): void => {
  const { target, selection, base } = scene;
  usePaletteSheetStore.getState().open({ kind, documentId: target.documentId, bankId: target.bank.id, first: selection[0] ?? base, last: selection.at(-1) ?? base });
};

const runners: Readonly<Record<PanelCommand, (scene: CommandScene) => void>> = {
  add: ({ target }) => {
    const slot = target.bank.slots[useToolStore.getState().foreground];
    report(addSwatch(target, nudgedColour(slot?.kind === 'color' ? slot.rgb : '#808080')));
  },
  ramp: ({ target, base }) =>
    useRampBuilderStore.getState().open({ documentId: target.documentId, bankId: target.bank.id, baseIndex: target.bank.slots[base]?.kind === 'color' ? base : 1 }),
  make: ({ target, selection }) => report(makeRamp(target, selection, false)),
  'make-light': ({ target, selection }) => report(makeRamp(target, selection, true)),
  gradient: (scene) => sheet(scene, 'gradient'),
  unused: (scene) => sheet(scene, 'unused'),
  duplicates: (scene) => sheet(scene, 'duplicates'),
  sort: ({ target, selection }) => report(sortSwatches(target, 'lightness', 'ascending', selection)),
};

const runPanelCommand = (command: PanelCommand, index?: number): void => {
  const target = currentTarget();
  if (!target) return;
  const selection = selectedIndices(target.bank);
  runners[command]({ target, selection, base: index ?? selection[0] ?? useToolStore.getState().foreground });
};

export { runPanelCommand };
