/* @layer renderer-app @kind logic */
import { sampleIndex } from '@bxel/document';
import type { EditorTarget } from '../editor/editor.type';

const coloursUsed = (target: EditorTarget): number => {
  const seen = new Set<number>();
  const { width, height } = target.sprite;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = sampleIndex(target.sprite, target.frameId, { x, y });
      if (index !== null && index !== 0) seen.add(index);
    }
  }
  return seen.size;
};

export { coloursUsed };
