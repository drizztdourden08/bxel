/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { AssetKey, CommandStep, SpriteId } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { toast } from '@drizztdourden08/brock-react';
import { trashEntry } from '../project/trash-entry';
import { spritesTarget } from '../sheet/sprites-target';
import { useDocumentStore } from '../stores/useDocumentStore';
import { runSteps } from '../transactions/run-steps';
import { fileName } from '../files/file-name';
import { parentOf } from '../workspace/parent-of';
import type { AssetRow } from './asset-list.type';
import { ASSET_LIST_TEXT } from './asset-list-text.constants';
import { rowTab } from './row-tab';

const deleteStep = (key: AssetKey): CommandStep | null => {
  if (key.kind === 'sprite') return { name: COMMAND_NAME.spriteDelete, targets: spritesTarget([key.id as SpriteId]), options: {} };
  if (key.kind === 'sheet') return { name: COMMAND_NAME.sheetDelete, targets: null, options: { sheet: key.id } };
  if (key.kind === 'tileset') return { name: COMMAND_NAME.tilesetDelete, targets: null, options: { tileset: key.id } };
  if (key.kind === 'tilemap') return { name: COMMAND_NAME.tilemapDelete, targets: null, options: { tilemap: key.id } };
  return key.kind === 'palette' ? { name: PALETTE_COMMAND_NAME.paletteDelete, targets: null, options: { bankId: key.id } } : null;
};

const removeLoaded = (row: AssetRow): void => {
  const tab = rowTab(row);
  const step = tab ? deleteStep(tab.key) : null;
  if (!tab || !step) return;
  const done = runSteps(useDocumentStore.getState().host, tab.documentId, ASSET_LIST_TEXT.trashLabel, [step]);
  if (done.ok) toast(ASSET_LIST_TEXT.removed(row.name), { variant: 'info' });
  else toast(ASSET_LIST_TEXT.removeFailed(done.error.message), { variant: 'danger' });
};

const trashRow = (row: AssetRow): void => {
  if (row.loaded) removeLoaded(row);
  else void trashEntry({ dir: parentOf(row.path), name: fileName(row.path), kind: 'file' });
};

export { trashRow };
