/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import { runDocument } from '../sheet/run-document';
import { animationStepsFor } from './animation-steps-for';
import type { DragEntry, DropTarget } from './drag-payload.type';
import { LABEL } from './manager-text.constants';
import { spriteStepsFor } from './sprite-steps-for';

const dropEntries = (entries: readonly DragEntry[], target: DropTarget, sheetId: string | null): boolean => {
  const artwork = currentArtwork();
  const sheet = artwork?.sheets.find((each) => each.id === sheetId);
  if (!artwork || !sheet) return false;
  const known = new Set(artwork.sprites.map((sprite) => sprite.id as string));
  const sprites = entries.filter((entry) => entry.kind === 'sprite' && known.has(entry.assetId)).map((entry) => entry.assetId as SpriteId);
  const animations = entries.filter((entry) => entry.kind === 'animation' && artwork.animations.some((each) => each.id === entry.assetId));
  const steps = [...(sprites.length > 0 ? spriteStepsFor(sheet, sprites, target) : []), ...(animations.length > 0 ? animationStepsFor(sheet, animations, target) : [])];
  if (steps.length === 0) return false;
  return runDocument(LABEL.dropEntries(sprites.length + animations.length), steps) !== null;
};

export { dropEntries };
