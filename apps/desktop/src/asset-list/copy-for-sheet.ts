/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Artwork, CommandStep, Sheet, SpriteId } from '@bxel/document';
import { toast } from '@drizztdourden08/brock-react';
import { spritesTarget } from '../sheet/sprites-target';
import { useDocumentStore } from '../stores/useDocumentStore';
import { runSteps } from '../transactions/run-steps';
import { activeSheetOf } from './active-sheet-of';
import type { AssetRow } from './asset-list.type';
import { ASSET_LIST_TEXT } from './asset-list-text.constants';
import { COPY_REF } from './copy-for-sheet.constants';
import { copyName } from './copy-name';

const removeFrom = (sheet: Sheet, target: CommandStep['targets']): CommandStep => ({
  name: COMMAND_NAME.sheetRemove,
  targets: target,
  options: { sheet: sheet.id },
});

const copySteps = (artwork: Artwork, sheet: Sheet, spriteId: SpriteId, name: string): readonly CommandStep[] => {
  const copyTarget = { sprites: [{ ref: COPY_REF }], layers: { by: 'all' as const }, frames: { by: 'all' as const } };
  const others = artwork.sheets.filter((each) => each.id !== sheet.id && each.entries.some((entry) => entry.spriteId === spriteId));
  return [
    { name: COMMAND_NAME.spriteDuplicate, targets: spritesTarget([spriteId]), options: { name }, ref: COPY_REF },
    ...others.map((each) => removeFrom(each, copyTarget)),
    removeFrom(sheet, spritesTarget([spriteId])),
  ];
};

const copyForSheet = (row: AssetRow): void => {
  const active = activeSheetOf();
  const { host } = useDocumentStore.getState();
  const artwork = active ? host.view(active.documentId)?.state.artwork : undefined;
  if (!active || !artwork || row.assetId === null) return;
  const spriteId = row.assetId as SpriteId;
  const name = copyName(artwork.sprites.map((sprite) => sprite.name), row.name);
  const done = runSteps(host, active.documentId, ASSET_LIST_TEXT.copyLabel, copySteps(artwork, active.sheet, spriteId, name));
  if (done.ok) toast(ASSET_LIST_TEXT.copiedForSheet(name), { variant: 'success' });
  else toast(ASSET_LIST_TEXT.duplicateFailed(done.error.message), { variant: 'danger' });
};

export { copyForSheet };
