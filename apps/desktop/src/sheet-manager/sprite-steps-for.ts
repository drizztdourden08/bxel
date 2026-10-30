/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, Sheet, SpriteId } from '@bxel/document';
import { spritesTarget } from '../sheet/sprites-target';
import type { DropTarget } from './drag-payload.type';
import { slotOf } from './slot-of';
import { spriteSteps } from './sprite-steps';

const spriteSlot = (sheet: Sheet, moved: ReadonlySet<SpriteId>, target: DropTarget): number => {
  const rest = sheet.entries.filter((entry) => !moved.has(entry.spriteId)).map((entry) => entry.spriteId as string);
  return target.key !== null && rest.includes(target.key) ? slotOf(rest, target.key, target.side) : rest.length;
};

const spriteStepsFor = (sheet: Sheet, ids: readonly SpriteId[], target: DropTarget): CommandStep[] => {
  const onSheet = new Set(sheet.entries.map((entry) => entry.spriteId));
  const loose = ids.filter((id) => !onSheet.has(id));
  const to = spriteSlot(sheet, new Set(ids), target);
  const add = loose.length > 0 ? spriteSteps(COMMAND_NAME.sheetAdd, loose, { sheet: sheet.id }) : [];
  const move: CommandStep = { name: COMMAND_NAME.spriteReorder, targets: spritesTarget(ids), options: { to, sheet: sheet.id } };
  return [...add, move];
};

export { spriteStepsFor };
