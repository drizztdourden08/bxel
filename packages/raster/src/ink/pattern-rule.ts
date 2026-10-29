/* @layer core @kind logic */
import type { BufferView } from '../buffer.type';
import { foldCoord } from '../fold-coord';
import type { Ink, InkRule } from './ink.type';

const patternRule = (patch: BufferView, ink: Extract<Ink, { kind: 'pattern' }>): InkRule => ({
  once: false,
  apply: (_current, x, y) => {
    const cell = patch.pixels[foldCoord(y - ink.originY, patch.height) * patch.width + foldCoord(x - ink.originX, patch.width)] ?? 0;
    return cell === 0 ? null : cell;
  },
});

export { patternRule };
