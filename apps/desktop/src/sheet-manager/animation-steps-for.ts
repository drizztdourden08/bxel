/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { AnimationId, CommandStep, Sheet, TagId } from '@bxel/document';
import { animationKey } from './animation-key';
import type { DragEntry, DropSide, DropTarget } from './drag-payload.type';
import { keyMoves } from './key-moves';

const animationEntryKeys = (sheet: Sheet): string[] => (sheet.animationEntries ?? []).map((entry) => animationKey(entry.animationId, entry.tagId));

const sideAfterAnchor = (anchored: boolean, target: DropTarget): DropSide => {
  if (anchored) return target.side;
  return target.key === null ? 'after' : 'before';
};

const animationStepsFor = (sheet: Sheet, entries: readonly DragEntry[], target: DropTarget): CommandStep[] => {
  const placed = new Set(animationEntryKeys(sheet));
  const keyOf = (entry: DragEntry): string => animationKey(entry.assetId as AnimationId, (entry.tagId ?? null) as TagId | null);
  const add: CommandStep[] = entries
    .filter((entry) => !placed.has(keyOf(entry)))
    .map((entry) => ({
      name: COMMAND_NAME.sheetAnimationAdd,
      targets: null,
      options: { sheet: sheet.id, animation: entry.assetId, tag: entry.tagId ? { by: 'id', id: entry.tagId } : null },
    }));
  const anchored = target.key !== null && animationEntryKeys(sheet).includes(target.key);
  const current = [...animationEntryKeys(sheet), ...entries.map(keyOf).filter((key) => !placed.has(key))];
  const moves = keyMoves(current, entries.map(keyOf), anchored ? target.key : null, sideAfterAnchor(anchored, target));
  const byKey = new Map(entries.map((entry) => [keyOf(entry), entry] as const));
  return [
    ...add,
    ...moves.flatMap(({ key, to }): CommandStep[] => {
      const entry = byKey.get(key);
      if (!entry) return [];
      return [
        {
          name: COMMAND_NAME.sheetAnimationMove,
          targets: null,
          options: { sheet: sheet.id, animation: entry.assetId, tag: entry.tagId ? { by: 'id', id: entry.tagId } : null, to },
        },
      ];
    }),
  ];
};

export { animationStepsFor };
