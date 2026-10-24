/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import { CHANNELS } from './sheet.constants';
import type { FrameImage } from './sheet.type';

const blitImage = (target: FrameImage, image: FrameImage, at: Point, alpha: number): void => {
  const stride = image.width * CHANNELS;
  const length = Math.max(0, Math.min(image.width, target.width - at.x)) * CHANNELS;
  for (let row = 0; row < image.height; row += 1) {
    const y = at.y + row;
    if (y < 0 || y >= target.height) continue;
    const line = image.rgba.subarray(row * stride, row * stride + length);
    const start = (y * target.width + at.x) * CHANNELS;
    target.rgba.set(line, start);
    if (alpha >= 1) continue;
    for (let at4 = CHANNELS - 1; at4 < line.length; at4 += CHANNELS) target.rgba[start + at4] = (line[at4] ?? 0) * alpha;
  }
};

export { blitImage };
