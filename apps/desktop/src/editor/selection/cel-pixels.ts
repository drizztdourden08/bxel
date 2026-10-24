/* @layer renderer-app @kind logic */
import type { EditorTarget } from '../editor.type';

const celPixels = (target: EditorTarget): Uint8Array => {
  const { sprite, layer, frameId } = target;
  const celId = layer.cels[frameId];
  const found = celId === undefined ? undefined : sprite.cels[celId]?.pixels;
  return found ?? new Uint8Array(sprite.width * sprite.height);
};

export { celPixels };
