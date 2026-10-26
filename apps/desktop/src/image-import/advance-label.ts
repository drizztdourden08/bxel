/* @layer renderer-app @kind logic */
import { TILED_TEXT } from '../tiled-import/tiled-import.constants';
import { IMPORT_TEXT } from './image-import.constants';
import type { ImportKind, ImportStep } from './image-import.type';

const advanceLabel = (step: ImportStep, steps: readonly ImportStep[], count: number, kind: ImportKind): string => {
  const following = steps[steps.indexOf(step) + 1];
  if (following === 'colors') return IMPORT_TEXT.nextColors;
  if (following === 'slicing') return IMPORT_TEXT.nextSlicing;
  if (kind === 'tiled') return TILED_TEXT.button;
  if (kind === 'animation' || kind === 'strip') return IMPORT_TEXT.importAnimation;
  return count === 1 ? IMPORT_TEXT.importSprite : IMPORT_TEXT.importSprites(count);
};

export { advanceLabel };
