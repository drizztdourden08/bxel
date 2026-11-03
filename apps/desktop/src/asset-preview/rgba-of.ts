/* @layer renderer-app @kind logic */
import type { RgbaImage as PlayerImage } from '@drizztdourden08/tessera';
import type { RgbaImage } from '@bxel/formats';
import { PLAYER_IMAGES } from './asset-preview.constants';

const rgbaOf = (image: RgbaImage): PlayerImage => {
  const kept = PLAYER_IMAGES.get(image);
  if (kept) return kept;
  const made = { width: image.width, height: image.height, rgba: Uint8ClampedArray.from(image.data) };
  PLAYER_IMAGES.set(image, made);
  return made;
};

export { rgbaOf };
