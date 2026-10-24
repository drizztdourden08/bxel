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
import { switchMode } from '../sheet/switch-mode';
import { toggleBroadcast } from '../sheet/toggle-broadcast';
import { useSpriteStore } from '../stores/useSpriteStore';
import { editorCommand } from './editor-command';
import { COMMAND_GROUP } from './keymap.constants';
import { SHEET_COMMAND as ID } from './sheet-command-id.constants';

const group = COMMAND_GROUP.sheet;

const leavable = (): boolean => hasActiveDocument() && leaveReady();

const onSelection = (run: (ids: ReturnType<typeof selectionIds>) => void) => (): void => {
  const scene = currentScene();
  if (scene) run(selectionIds(scene));
};

const MODE_COMMANDS: readonly CommandDef[] = [
  { id: ID.modeSprite, label: 'Sprite mode', group, chord: 'Alt+1', whileTyping: false, run: () => void switchMode('sprite') },
  { id: ID.modeSheet, label: 'Sheet mode', group, chord: 'Alt+2', whileTyping: false, run: () => void switchMode('sheet') },
  { id: ID.modeTilemap, label: 'Tilemap mode', group, chord: 'Alt+3', whileTyping: false, run: () => void switchMode('tilemap') },
  { id: ID.isolate, label: 'Isolate sprite', group, run: () => isolateSprite() },
  { id: ID.back, label: 'Back to sheet', group, chord: 'Escape', whileTyping: false, when: leavable, run: leaveAction },
  { id: ID.broadcast, label: 'Paint all selected', group, chord: 'Alt+B', whileTyping: false, run: toggleBroadcast },
];

const SPRITE_COMMANDS: readonly CommandDef[] = [
  { id: ID.duplicateSprite, label: 'Duplicate sprite', group, chord: 'Mod+Shift+D', whileTyping: false, run: onSelection(duplicateSprites) },
  { id: ID.deleteSprite, label: 'Delete sprite', group, run: onSelection(deleteSprites) },
  { id: ID.moveEarlier, label: 'Move sprite earlier', group, run: onSelection((ids) => reorderSprites(ids, { by: -1 })) },
  { id: ID.moveLater, label: 'Move sprite later', group, run: onSelection((ids) => reorderSprites(ids, { by: 1 })) },
  { id: ID.renameSprite, label: 'Rename sprite', group, run: () => useSpriteStore.getState().setRenaming(currentScene()?.active?.id ?? null) },
  { id: ID.duplicateFrame, label: 'Duplicate frame', group, run: duplicateFrame },
];

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

const SHEET_EDITOR_COMMANDS: readonly CommandDef[] = [...MODE_COMMANDS, ...SPRITE_COMMANDS, ...SHEET_COMMANDS].map(editorCommand);

export { SHEET_EDITOR_COMMANDS };
