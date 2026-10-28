/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Artwork, CommandStep, Sheet, SpriteId } from '@bxel/document';
import { spritesTarget } from '../sheet/sprites-target';
import type { DropTarget } from './drag-payload.type';
import { slotOf } from './slot-of';
import { spriteSteps } from './sprite-steps';

const spriteSlot = (artwork: Artwork, sheet: Sheet, moved: ReadonlySet<SpriteId>, target: DropTarget): number | null => {
  const rest = artwork.sprites.filter((sprite) => !moved.has(sprite.id)).map((sprite) => sprite.id as string);
  const onSheet = new Set(sheet.entries.map((entry) => entry.spriteId as string));
  const lastOnSheet = rest.reduce((last, id, index) => (onSheet.has(id) ? index : last), -1);
  if (target.key !== null && rest.includes(target.key)) return slotOf(rest, target.key, target.side);
  return lastOnSheet + 1;
};

const spriteStepsFor = (artwork: Artwork, sheet: Sheet, ids: readonly SpriteId[], target: DropTarget): CommandStep[] => {
  const onSheet = new Set(sheet.entries.map((entry) => entry.spriteId));
  const loose = ids.filter((id) => !onSheet.has(id));
  const to = spriteSlot(artwork, sheet, new Set(ids), target);
  const add = loose.length > 0 ? spriteSteps(COMMAND_NAME.sheetAdd, loose, { sheet: sheet.id }) : [];
  const move: CommandStep[] = to === null ? [] : [{ name: COMMAND_NAME.spriteReorder, targets: spritesTarget(ids), options: { to } }];
  return [...add, ...move];
};

export { spriteStepsFor };
