/* @layer core @kind logic */
import { clearBox } from '../pixels/clear-box';
import { GIF_DISPOSAL } from './gif-disposal.constants';
import type { GifDecodeState } from './gif.type';

const applyGifDisposal = (state: GifDecodeState): void => {
  const { pending, canvas, screen } = state;
  state.pending = undefined;
  if (!pending) return;
  if (pending.method === GIF_DISPOSAL.PREVIOUS && pending.backup) canvas.set(pending.backup);
  if (pending.method === GIF_DISPOSAL.BACKGROUND) clearBox(canvas, screen.width, pending);
};

export { applyGifDisposal };
