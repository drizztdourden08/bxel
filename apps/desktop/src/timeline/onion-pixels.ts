/* @layer renderer-app @kind logic */
import { composeAnimationFrame, TRANSPARENT_INDEX } from '@bxel/document';
import type { AnimFrameId } from '@bxel/document';
import { bankRgba } from '../export/bank-rgba';
import { GREY_WEIGHTS } from './onion.constants';
import type { OnionGhost, OnionSource, Rgb } from './onion.type';
import { edgeMask } from './edge-mask';
import { hexRgb } from './hex-rgb';
import { patternKeeps } from './pattern-keeps';

const tinted = (rgba: Uint8Array, at: number, ghost: OnionGhost): Rgb => {
  const own: Rgb = [rgba[at] ?? 0, rgba[at + 1] ?? 0, rgba[at + 2] ?? 0];
  if (ghost.tint === 'split') return hexRgb(ghost.colour);
  if (ghost.tint === 'none') return own;
  const grey = Math.round(own[0] * GREY_WEIGHTS[0] + own[1] * GREY_WEIGHTS[1] + own[2] * GREY_WEIGHTS[2]);
  return [grey, grey, grey];
};

const onionPixels = (source: OnionSource, shown: AnimFrameId, ghost: OnionGhost): Uint8ClampedArray<ArrayBuffer> => {
  const { artwork, animation, bank } = source;
  const table = bankRgba(bank);
  const current = composeAnimationFrame(artwork, animation, shown);
  const indices = composeAnimationFrame(artwork, animation, ghost.frameId, ghost.flip);
  const edges = ghost.style === 'outline' ? edgeMask(indices, animation.width, animation.height) : null;
  const out = new Uint8ClampedArray(indices.length * 4);
  for (const [position, index] of indices.entries()) {
    if (index === TRANSPARENT_INDEX || (ghost.behind && current[position] !== TRANSPARENT_INDEX)) continue;
    if (edges?.[position] === 0) continue;
    if (!patternKeeps(ghost.pattern, ghost.side, { x: position % animation.width, y: Math.floor(position / animation.width) })) continue;
    out.set([...tinted(table, index * 4, ghost), 255], position * 4);
  }
  return out;
};

export { onionPixels };
