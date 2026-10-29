/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { AnimationId, Artwork, CommandStep, Point, Sheet, SpriteId, TagId } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import { runDocument } from '../sheet/run-document';
import { spritesTarget } from '../sheet/sprites-target';
import { animationKey } from './animation-key';
import type { DragEntry } from './drag-payload.type';
import { dropEntries } from './drop-entries';
import { LABEL } from './manager-text.constants';
import { spriteSteps } from './sprite-steps';

const clampPoint = (point: Point): Point => ({ x: Math.max(0, Math.round(point.x)), y: Math.max(0, Math.round(point.y)) });

const placeSteps = (sheet: Sheet, ids: readonly SpriteId[], point: Point): CommandStep[] => {
  const first = sheet.entries.find((entry) => entry.spriteId === ids[0]);
  if (!first || ids.length === 0) return [];
  const by = { x: point.x - first.at.x, y: point.y - first.at.y };
  return [{ name: COMMAND_NAME.sheetPlace, targets: spritesTarget(ids), options: { sheet: sheet.id, by } }];
};

const addSteps = (artwork: Artwork, sheet: Sheet, ids: readonly SpriteId[], point: Point): CommandStep[] => {
  if (ids.length === 0) return [];
  let x = point.x;
  const places = ids.map((id) => {
    const at = { x, y: point.y };
    x += (artwork.sprites.find((sprite) => sprite.id === id)?.width ?? 0) + sheet.spacing.x;
    return at;
  });
  return spriteSteps(COMMAND_NAME.sheetAdd, ids, { sheet: sheet.id, places });
};

const stripSteps = (artwork: Artwork, sheet: Sheet, entries: readonly DragEntry[], point: Point): CommandStep[] => {
  const placed = new Set((sheet.animationEntries ?? []).map((entry) => animationKey(entry.animationId, entry.tagId)));
  let y = point.y;
  return entries
    .filter((entry) => !placed.has(animationKey(entry.assetId as AnimationId, (entry.tagId ?? null) as TagId | null)))
    .map((entry) => {
      const at = { x: point.x, y };
      y += (artwork.animations.find((animation) => animation.id === entry.assetId)?.height ?? 0) + sheet.spacing.y;
      return { name: COMMAND_NAME.sheetAnimationAdd, targets: null, options: { sheet: sheet.id, animation: entry.assetId, tag: entry.tagId ? { by: 'id', id: entry.tagId } : null, at } };
    });
};

const dropOnCanvas = (entries: readonly DragEntry[], point: Point, sheetId: string | null): boolean => {
  const artwork = currentArtwork();
  const sheet = artwork?.sheets.find((each) => each.id === sheetId);
  if (!artwork || !sheet) return false;
  if (sheet.layout.kind !== 'manual') return dropEntries(entries, { key: null, side: 'after' }, sheetId);
  const at = clampPoint(point);
  const onSheet = new Set<string>(sheet.entries.map((entry) => entry.spriteId));
  const known = new Set<string>(artwork.sprites.map((sprite) => sprite.id));
  const sprites = entries.filter((entry) => entry.kind === 'sprite' && known.has(entry.assetId)).map((entry) => entry.assetId as SpriteId);
  const steps = [
    ...placeSteps(sheet, sprites.filter((id) => onSheet.has(id)), at),
    ...addSteps(artwork, sheet, sprites.filter((id) => !onSheet.has(id)), at),
    ...stripSteps(artwork, sheet, entries.filter((entry) => entry.kind === 'animation'), at),
  ];
  return steps.length > 0 && runDocument(LABEL.dropEntries(entries.length), steps) !== null;
};

export { dropOnCanvas };
