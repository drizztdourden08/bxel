/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import type { AnimationContext, EditorTarget } from '../../../editor/editor.type';
import { onionPixels } from '../../../timeline/onion-pixels';
import type { OnionGhost } from '../../../timeline/onion.type';
import { ghostCanvas } from './ghost-canvas';
import { GHOSTS } from './onion-ghost.constants';

const onionGhost = (canvas: HTMLCanvasElement, artwork: Artwork, target: EditorTarget & { animation: AnimationContext }, ghost: OnionGhost): HTMLCanvasElement => {
  const { animation, frame } = target.animation;
  const made = GHOSTS.get(artwork) ?? new Map<string, HTMLCanvasElement>();
  GHOSTS.set(artwork, made);
  const key = `${animation.id}|${frame.id}|${ghost.frameId}|${ghost.flip ?? ''}|${ghost.side}|${ghost.tint}`;
  const hit = made.get(key);
  if (hit) return hit;
  const pixels = onionPixels({ artwork, animation, bank: target.bank }, frame.id, ghost);
  const fresh = ghostCanvas(canvas.ownerDocument, animation, pixels);
  made.set(key, fresh);
  return fresh;
};

export { onionGhost };
