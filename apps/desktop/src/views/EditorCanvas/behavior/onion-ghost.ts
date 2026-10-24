/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import type { EditorTarget } from '../../../editor/editor.type';
import { onionPixels } from '../../../timeline/onion-pixels';
import type { OnionGhost } from '../../../timeline/onion.type';
import { ghostCanvas } from './ghost-canvas';
import { GHOSTS } from './onion-ghost.constants';

const onionGhost = (canvas: HTMLCanvasElement, target: EditorTarget, ghost: OnionGhost): HTMLCanvasElement => {
  const { sprite, bank, frameId } = target;
  const bySprite = GHOSTS.get(bank) ?? new WeakMap<Sprite, Map<string, HTMLCanvasElement>>();
  GHOSTS.set(bank, bySprite);
  const made = bySprite.get(sprite) ?? new Map<string, HTMLCanvasElement>();
  bySprite.set(sprite, made);
  const key = `${frameId}|${ghost.frameId}|${ghost.side}|${ghost.tint}`;
  const hit = made.get(key);
  if (hit) return hit;
  const fresh = ghostCanvas(canvas.ownerDocument, sprite, onionPixels(sprite, bank, frameId, ghost));
  made.set(key, fresh);
  return fresh;
};

export { onionGhost };
