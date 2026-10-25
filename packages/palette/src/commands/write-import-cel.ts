/* @layer core @kind logic */
import { ensureCel, ERROR_CODE, fail, writableCel } from '@bxel/document';
import type { Draft, Sprite } from '@bxel/document';

const writeImportCel = (draft: Draft, sprite: Sprite, pixels: Uint8Array, frameAt = 0): void => {
  const layer = sprite.layers[0];
  const frame = sprite.frames[frameAt];
  if (!layer || !frame) throw fail(ERROR_CODE.TARGET_EMPTY, `Sprite "${sprite.name}" has no layer or frame to hold the image.`);
  const celId = ensureCel(draft, { spriteId: sprite.id, layerId: layer.id, frameId: frame.id, celId: null });
  writableCel(draft, sprite.id, celId).set(pixels);
};

export { writeImportCel };
