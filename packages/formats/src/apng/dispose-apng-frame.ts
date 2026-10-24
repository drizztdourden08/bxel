/* @layer core @kind logic */
import { clearBox } from '../pixels/clear-box';
import { APNG_OP } from './apng-op.constants';
import type { ApngRenderState } from './apng.type';

const disposeApngFrame = (state: ApngRenderState): void => {
  const { pending } = state;
  state.pending = undefined;
  if (!pending) return;
  if (pending.dispose === APNG_OP.DISPOSE_BACKGROUND) {
    clearBox(state.canvas, state.width, pending.region);
  }
  if (pending.dispose === APNG_OP.DISPOSE_PREVIOUS && pending.backup) {
    state.canvas.set(pending.backup);
  }
};

export { disposeApngFrame };
