/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import { sizeKey } from './size-key';

const size = (key: string): number[] => key.split('x').map(Number);

const sizeOptions = (sprites: readonly Sprite[]): string[] =>
  [...new Set(sprites.map(sizeKey))].sort((a, b) => {
    const [aw = 0, ah = 0] = size(a);
    const [bw = 0, bh = 0] = size(b);
    return aw * ah - bw * bh || aw - bw;
  });

export { sizeOptions };
