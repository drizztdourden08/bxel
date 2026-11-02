/* @layer renderer-app @kind constants */
import { toast } from '@drizztdourden08/brock-react';
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { commandArgs } from '../context-menu/command-args';
import { copyHexList } from '../palette-export/copy-hex-list';
import { exportPaletteFile } from '../palette-export/export-palette-file';
import { PALETTE_EXPORT_TEXT } from '../palette-export/palette-export.constants';
import { saveProjectPalette } from '../palette-export/save-project-palette';
import { addToRamp } from '../palette-panel/add-to-ramp';
import { currentPaletteTarget } from '../palette-panel/current-palette-target';
import type { ReplaceScope } from '../palette-panel/palette-panel.type';
import { replaceRampSteps } from '../palette-panel/replace-ramp-steps';
import { replaceWithFront } from '../palette-panel/replace-with-front';
import { selectedIndices } from '../palette-panel/selected-indices';
import { startPreview } from '../palette-preview/start-preview';
import { endPreview } from '../palette-preview/end-preview';
import { usePaletteImportStore } from '../stores/usePaletteImportStore';
import { usePaletteSheetStore } from '../stores/usePaletteSheetStore';
import { COMMAND_GROUP } from './keymap.constants';
import { PALETTE_TRANSFER_COMMAND } from './palette-transfer-command-id.constants';
import { ruled } from './ruled';
import type { TransferArgs } from './transfer-args.type';

const group = COMMAND_GROUP.colours;

const SELECT_FIRST = 'Select some swatches first.';

const withTarget = (selection: boolean | undefined, run: (target: NonNullable<ReturnType<typeof currentPaletteTarget>>, indices: readonly number[] | null) => void): void => {
  const target = currentPaletteTarget();
  if (!target) return;
  const indices = selection === true ? selectedIndices(target.bank) : null;
  if (indices !== null && indices.length === 0) {
    toast(SELECT_FIRST, { variant: 'info' });
    return;
  }
  run(target, indices);
};

const PALETTE_TRANSFER_COMMANDS: readonly CommandDef[] = [
  {
    id: PALETTE_TRANSFER_COMMAND.import,
    label: 'Import colours into the palette',
    group,
    run: () => {
      const target = currentPaletteTarget();
      if (target) usePaletteImportStore.getState().open({ documentId: target.documentId, bankId: target.bank.id });
    },
  },
  {
    id: PALETTE_TRANSFER_COMMAND.export,
    label: PALETTE_EXPORT_TEXT.title,
    group,
    run: (context?: CommandContext) => {
      const { format, selection } = commandArgs<TransferArgs>(context);
      withTarget(selection, (target, indices) => void exportPaletteFile(target, format ?? 'gpl', indices));
    },
  },
  {
    id: PALETTE_TRANSFER_COMMAND.copyList,
    label: 'Copy the colours as a hex list',
    group,
    run: (context?: CommandContext) => withTarget(commandArgs<TransferArgs>(context).selection, (target, indices) => void copyHexList(target, indices)),
  },
  {
    id: PALETTE_TRANSFER_COMMAND.saveProject,
    label: 'Save the colours as a project palette',
    group,
    run: (context?: CommandContext) => withTarget(commandArgs<TransferArgs>(context).selection, (target, indices) => void saveProjectPalette(target, indices)),
  },
  {
    id: PALETTE_TRANSFER_COMMAND.previewWith,
    label: 'Preview the drawing with another palette',
    group,
    run: (context?: CommandContext) => {
      const target = currentPaletteTarget();
      const { bankId } = commandArgs<TransferArgs>(context);
      if (target && bankId !== undefined) startPreview(target, bankId);
    },
  },
  { id: PALETTE_TRANSFER_COMMAND.previewEnd, label: 'End the palette preview', group, run: endPreview },
  {
    id: PALETTE_TRANSFER_COMMAND.replaceFront,
    label: 'Replace the pixels of a swatch with the front colour',
    group,
    run: (context?: CommandContext) => {
      const { index, scope } = commandArgs<{ index: number; scope: ReplaceScope }>(context);
      if (index !== undefined) replaceWithFront(index, scope ?? 'sprite');
    },
  },
  {
    id: PALETTE_TRANSFER_COMMAND.replaceRamp,
    label: 'Replace a ramp with another ramp',
    group,
    run: (context?: CommandContext) => {
      const { from, to, scope } = commandArgs<{ from: string; to: string; scope: ReplaceScope }>(context);
      if (from !== undefined && to !== undefined) replaceRampSteps(from, to, scope ?? 'sprite');
    },
  },
  {
    id: PALETTE_TRANSFER_COMMAND.addToRamp,
    label: 'Add a swatch to a ramp',
    group,
    run: (context?: CommandContext) => {
      const { index, ramp } = commandArgs<{ index: number; ramp: string }>(context);
      if (index !== undefined && ramp !== undefined) addToRamp(index, ramp);
    },
  },
  {
    id: PALETTE_TRANSFER_COMMAND.moveColour,
    label: 'Move a colour only, keeping every index',
    group,
    run: (context?: CommandContext) => {
      const target = currentPaletteTarget();
      const { index } = commandArgs<{ index: number }>(context);
      if (!target) return;
      const from = index ?? selectedIndices(target.bank)[0];
      if (from === undefined) return;
      usePaletteSheetStore.getState().open({ kind: 'move', documentId: target.documentId, bankId: target.bank.id, first: from, last: Math.min(from + 1, target.bank.slots.length - 1) });
    },
  },
].map(ruled);

export { PALETTE_TRANSFER_COMMANDS };
