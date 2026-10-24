/* @layer renderer-app @kind logic */
import { ANT_PERIOD, ANT_STEP_MS, REDUCED_MOTION } from '../EditorCanvas.constants';

const antPhase = (canvas: HTMLCanvasElement): number => {
  const still = canvas.ownerDocument.defaultView?.matchMedia(REDUCED_MOTION).matches ?? true;
  return still ? 0 : Math.floor(performance.now() / ANT_STEP_MS) % ANT_PERIOD;
};

export { antPhase };
