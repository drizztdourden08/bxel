/* @layer renderer-app @kind logic */
import { IMPORT_TEXT } from './image-import.constants';
import type { ImportStep } from './image-import.type';

const advanceLabel = (step: ImportStep, steps: readonly ImportStep[], count: number): string => {
  const following = steps[steps.indexOf(step) + 1];
  if (following === 'colors') return IMPORT_TEXT.nextColors;
  if (following === 'slicing') return IMPORT_TEXT.nextSlicing;
  return count === 1 ? IMPORT_TEXT.importSprite : IMPORT_TEXT.importSprites(count);
};

export { advanceLabel };
