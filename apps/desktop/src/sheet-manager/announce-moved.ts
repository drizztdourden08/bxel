/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import type { Sheet } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import type { DragEntry } from './drag-payload.type';
import { ANNOUNCE_TEXT } from './announce-moved.constants';

const wasPlaced = (sheet: Sheet, entries: readonly DragEntry[]): boolean =>
  entries.length > 0 &&
  entries.every((entry) =>
    entry.kind === 'sprite'
      ? sheet.entries.some((each) => each.spriteId === entry.assetId)
      : (sheet.animationEntries ?? []).some((each) => each.animationId === entry.assetId),
  );

const positionOf = (sheet: Sheet, entry: DragEntry | undefined): number => {
  if (entry === undefined) return -1;
  if (entry.kind === 'sprite') return sheet.entries.findIndex((each) => each.spriteId === entry.assetId);
  return (sheet.animationEntries ?? []).findIndex((each) => each.animationId === entry.assetId);
};

const announceMoved = (before: Sheet, entries: readonly DragEntry[]): void => {
  if (!wasPlaced(before, entries)) return;
  const after = currentArtwork()?.sheets.find((each) => each.id === before.id);
  const first = entries[0];
  const at = after ? positionOf(after, first) : -1;
  if (!after || first === undefined || at < 0) return;
  const total = first.kind === 'sprite' ? after.entries.length : (after.animationEntries ?? []).length;
  announce(ANNOUNCE_TEXT.movedToPlace(at + 1, total));
};

export { announceMoved };
