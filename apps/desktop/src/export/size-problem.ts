/* @layer renderer-app @kind logic */
import { EXPORT_LIMITS, EXPORT_TEXT } from './export.constants';
import type { ExportSettings, Target } from './export.type';

const sizeProblem = (targets: readonly Target[], settings: ExportSettings): string | null => {
  const { scale } = settings;
  const gif = settings.kind === 'animation' && settings.animation === 'gif';
  const side = gif ? EXPORT_LIMITS.maxGifSide : EXPORT_LIMITS.maxSide;
  for (const { sprite } of targets) {
    const width = sprite.width * scale;
    const height = sprite.height * scale;
    if (Math.max(width, height) > side || width * height > EXPORT_LIMITS.maxPixels) {
      return gif ? EXPORT_TEXT.gifTooLarge(width, height) : EXPORT_TEXT.tooLarge(width, height);
    }
  }
  return null;
};

export { sizeProblem };
