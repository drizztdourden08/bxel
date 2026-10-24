/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Sheet, SpriteId } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import { runDocument } from '../sheet/run-document';
import { spritesTarget } from '../sheet/sprites-target';
import { ALIGN_TEXT } from './align-text.constants';
import { alignPlan } from './align-plan';
import type { AlignBox, AlignMode } from './align.type';

const alignBoxes = (sheet: Sheet, ids: readonly SpriteId[]): AlignBox[] => {
  const sprites = currentArtwork()?.sprites ?? [];
  return sheet.entries.flatMap((entry) => {
    const sprite = ids.includes(entry.spriteId) ? sprites.find((each) => each.id === entry.spriteId) : undefined;
    return sprite ? [{ id: sprite.id, x: entry.at.x, y: entry.at.y, width: sprite.width, height: sprite.height }] : [];
  });
};

const alignSprites = (sheet: Sheet | null, ids: readonly SpriteId[], mode: AlignMode): boolean => {
  if (sheet?.layout.kind !== 'manual') return false;
  const moves = alignPlan(alignBoxes(sheet, ids), mode);
  const steps = moves.map((move) => ({
    name: COMMAND_NAME.sheetPlace,
    targets: spritesTarget([move.id]),
    options: { sheet: sheet.id, at: move.at },
  }));
  return steps.length > 0 && runDocument(ALIGN_TEXT.label(mode, steps.length), steps) !== null;
};

export { alignSprites };
