/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { AnimationId, Artwork, CommandStep, Sheet, SpriteId, TagId } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import { runDocument } from '../sheet/run-document';
import { spritesTarget } from '../sheet/sprites-target';
import { animationKey } from './animation-key';
import type { DragEntry, DropTarget } from './drag-payload.type';
import { keyMoves, slotOf } from './entry-order';
import { LABEL } from './manager-text.constants';
import { spriteSteps } from './sprite-steps';

const animationEntryKeys = (sheet: Sheet): string[] => (sheet.animationEntries ?? []).map((entry) => animationKey(entry.animationId, entry.tagId));

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
  const moves = keyMoves(current, entries.map(keyOf), anchored ? target.key : null, anchored ? target.side : target.key === null ? 'after' : 'before');
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

const dropEntries = (entries: readonly DragEntry[], target: DropTarget, sheetId: string | null): boolean => {
  const artwork = currentArtwork();
  const sheet = artwork?.sheets.find((each) => each.id === sheetId);
  if (!artwork || !sheet) return false;
  const known = new Set(artwork.sprites.map((sprite) => sprite.id as string));
  const sprites = entries.filter((entry) => entry.kind === 'sprite' && known.has(entry.assetId)).map((entry) => entry.assetId as SpriteId);
  const animations = entries.filter((entry) => entry.kind === 'animation' && artwork.animations.some((each) => each.id === entry.assetId));
  const steps = [...(sprites.length > 0 ? spriteStepsFor(artwork, sheet, sprites, target) : []), ...(animations.length > 0 ? animationStepsFor(sheet, animations, target) : [])];
  if (steps.length === 0) return false;
  return runDocument(LABEL.dropEntries(sprites.length + animations.length), steps) !== null;
};

export { animationStepsFor, dropEntries, spriteStepsFor };
