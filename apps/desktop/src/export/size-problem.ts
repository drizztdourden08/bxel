/* @layer renderer-app @kind logic */
import { EXPORT_LIMITS, EXPORT_TEXT } from './export.constants';
import type { ExportSettings } from './export.type';
import type { SheetDim } from './export-parts.type';

const sizeProblem = (sizes: readonly Pick<SheetDim, 'width' | 'height'>[], settings: ExportSettings): string | null => {
  const { scale } = settings;
  const gif = settings.kind === 'animation' && settings.animation === 'gif';
  const side = gif ? EXPORT_LIMITS.maxGifSide : EXPORT_LIMITS.maxSide;
  for (const size of sizes) {
    const width = size.width * scale;
    const height = size.height * scale;
    if (Math.max(width, height) > side || width * height > EXPORT_LIMITS.maxPixels) {
      return gif ? EXPORT_TEXT.gifTooLarge(width, height) : EXPORT_TEXT.tooLarge(width, height);
    }
  }
  return null;
};

export { sizeProblem };
