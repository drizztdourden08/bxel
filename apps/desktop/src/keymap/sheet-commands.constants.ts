/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { hasActiveDocument } from '../files/has-active-document';
import { startImport } from '../image-import/start-import';
import { arrangeKind } from '../sheet/arrange-kind';
import { currentScene } from '../sheet/current-scene';
import { deleteSprites } from '../sheet/delete-sprites';
import { duplicateFrame } from '../sheet/duplicate-frame';
import { duplicateSprites } from '../sheet/duplicate-sprites';
import { isolateSprite } from '../sheet/isolate-sprite';
import { leaveAction } from '../sheet/leave-action';
import { leaveReady } from '../sheet/leave-ready';
import { removeSlices } from '../sheet/remove-slices';
import { reorderSprites } from '../sheet/reorder-sprites';
import { selectionIds } from '../sheet/selection-ids';
import { toggleBroadcast } from '../sheet/toggle-broadcast';
import { useManagerStore } from '../stores/useManagerStore';
import { useSpriteStore } from '../stores/useSpriteStore';
import { COMMAND_ZONE } from './command-zone.constants';
import { editorCommand } from './editor-command';
import { COMMAND_GROUP } from './keymap.constants';
import { onSurface } from './on-surface';
import { SHEET_COMMAND as ID } from './sheet-command-id.constants';

const group = COMMAND_GROUP.sheet;

const hasActiveSprite = (): boolean => (currentScene()?.active ?? null) !== null;

const leavable = (): boolean => hasActiveDocument() && leaveReady();

const onSelection = (run: (ids: ReturnType<typeof selectionIds>) => void) => (): void => {
  const scene = currentScene();
  if (scene) run(selectionIds(scene));
};

const SCOPE_COMMANDS: readonly CommandDef[] = [
  { id: ID.back, label: 'Back to sheet', group, chord: 'Escape', whileTyping: false, when: leavable, run: leaveAction },
  { id: ID.broadcast, label: 'Paint all selected', group, chord: 'Alt+B', whileTyping: false, run: toggleBroadcast },
];

const SPRITE_COMMANDS: readonly CommandDef[] = [
  { id: ID.isolate, label: 'Isolate sprite', group, run: () => isolateSprite() },
  { id: ID.duplicateSprite, label: 'Duplicate sprite', group, chord: 'Mod+Shift+D', whileTyping: false, run: onSelection(duplicateSprites) },
  { id: ID.deleteSprite, label: 'Delete sprite', group, run: onSelection(deleteSprites) },
  {
    id: ID.askDeleteSprite,
    label: 'Delete sprites...',
    group,
    chord: 'Delete',
    zone: COMMAND_ZONE.sprites,
    whileTyping: false,
    when: () => hasActiveDocument() && hasActiveSprite(),
    run: () => useManagerStore.getState().patch({ dialog: 'delete' }),
  },
  { id: ID.moveEarlier, label: 'Move sprite earlier', group, run: onSelection((ids) => reorderSprites(ids, { by: -1 })) },
  { id: ID.moveLater, label: 'Move sprite later', group, run: onSelection((ids) => reorderSprites(ids, { by: 1 })) },
  {
    id: ID.renameSprite,
    label: 'Rename sprite',
    group,
    chord: 'F2',
    zone: COMMAND_ZONE.sprites,
    whileTyping: false,
    run: () => useSpriteStore.getState().setRenaming(currentScene()?.active?.id ?? null),
  },
];

const FRAME_COMMANDS: readonly CommandDef[] = [{ id: ID.duplicateFrame, label: 'Duplicate frame', group, run: duplicateFrame }];

const SHEET_COMMANDS: readonly CommandDef[] = [
  { id: ID.arrangeGrid, label: 'Arrange as grid', group, run: () => void arrangeKind('grid') },
  { id: ID.arrangePacked, label: 'Arrange packed', group, run: () => void arrangeKind('packed') },
  { id: ID.arrangeManual, label: 'Arrange by hand', group, run: () => void arrangeKind('manual') },
  {
    id: ID.importSheet,
    label: 'Slice grid',
    group,
    run: () => {
      void startImport();
    },
  },
  { id: ID.sliceAdd, label: 'Add slice', group, run: () => useSpriteStore.getState().setSliceDraw(true) },
  { id: ID.sliceRemove, label: 'Remove slices', group, run: onSelection((ids) => void removeSlices(ids)) },
];

const SHEET_EDITOR_COMMANDS: readonly CommandDef[] = [
  ...SCOPE_COMMANDS.map(editorCommand),
  ...FRAME_COMMANDS.map(onSurface('sprite', 'tile')),
  ...[...SPRITE_COMMANDS, ...SHEET_COMMANDS].map(onSurface('sheet')),
];

export { SHEET_EDITOR_COMMANDS };
