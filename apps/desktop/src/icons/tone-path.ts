/* @layer renderer-app @kind logic */
import { TONE_RUNS } from './pixel-icon.constants';
import type { PixelBitmap, PixelTone } from './pixel-icon.type';

const tonePath = (bitmap: PixelBitmap, tone: PixelTone): string =>
  bitmap
    .flatMap((row, y) => [...row.matchAll(TONE_RUNS[tone])].map((run) => `M${run.index} ${y}h${run[0].length}v1h-${run[0].length}z`))
    .join('');

export { tonePath };
