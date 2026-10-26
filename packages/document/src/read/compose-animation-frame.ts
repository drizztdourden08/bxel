/* @layer core @kind logic */
import type { AnimFlip, Animation } from '../model/animation.type';
import type { Point } from '../model/geometry.type';
import type { AnimFrameId } from '../model/ids.type';
import type { Artwork } from '../model/artwork.type';
import { emptyCel } from '../pixels/empty-cel';
import { animFrameImage } from './anim-frame-image';
import type { AnimFrameImage } from './anim-frame-image.type';
import { animFrameOrigin } from './anim-frame-origin';

const mirrored = (value: number, axis: number, active: boolean): number => (active ? axis - 1 - value : value);

const place = (canvas: Animation, image: AnimFrameImage, origin: Point, flip: AnimFlip | null): Uint8Array => {
  const out = emptyCel(canvas);
  for (let row = 0; row < image.height; row += 1) {
    for (let column = 0; column < image.width; column += 1) {
      const value = image.pixels[row * image.width + column] ?? 0;
      const x = mirrored(origin.x + column, canvas.anchor.x2, flip === 'x');
      const y = mirrored(origin.y + row, canvas.anchor.y2, flip === 'y');
      if (value !== 0 && x >= 0 && y >= 0 && x < canvas.width && y < canvas.height) out[y * canvas.width + x] = value;
    }
  }
  return out;
};

const composeAnimationFrame = (
  artwork: Artwork,
  animation: Animation,
  frameId: AnimFrameId,
  flip: AnimFlip | null = null,
): Uint8Array => {
  const frame = animation.frames.find((item) => item.id === frameId);
  const image = frame ? animFrameImage(artwork, frame) : null;
  if (!frame || !image) return emptyCel(animation);
  return place(animation, image, animFrameOrigin(artwork, animation, frame), flip);
};

export { composeAnimationFrame };
