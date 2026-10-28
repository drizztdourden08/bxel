/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, SheetId } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import { runDocument } from '../sheet/run-document';
import { animationKey } from './animation-key';
import { shiftKeys, wantedMoves } from './entry-order';
import { LABEL } from './manager-text.constants';

const moveAnimations = (keys: readonly string[], by: number, sheetId: SheetId | null): boolean => {
  const sheet = currentArtwork()?.sheets.find((each) => each.id === sheetId);
  const entries = sheet?.animationEntries ?? [];
  if (!sheet || keys.length === 0 || entries.length === 0) return false;
  const current = entries.map((entry) => animationKey(entry.animationId, entry.tagId));
  const moved = new Set(keys);
  const wanted = Array.from({ length: Math.min(Math.abs(by), entries.length) }).reduce<string[]>((list) => shiftKeys(list, moved, by), current);
  const steps: CommandStep[] = wantedMoves(current, wanted).flatMap(({ key, to }): CommandStep[] => {
    const entry = entries[current.indexOf(key)];
    if (!entry) return [];
    return [
      {
        name: COMMAND_NAME.sheetAnimationMove,
        targets: null,
        options: { sheet: sheet.id, animation: entry.animationId, tag: entry.tagId ? { by: 'id', id: entry.tagId } : null, to },
      },
    ];
  });
  return steps.length > 0 && runDocument(LABEL.moveAnimations(keys.length), steps) !== null;
};

export { moveAnimations };
