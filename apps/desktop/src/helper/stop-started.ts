/* @layer helper @kind logic */
import { STOP_WAIT_MS } from './helper.constants';
import type { HelperState } from './helper.type';

const stopStarted = async (state: HelperState): Promise<void> => {
  const started = state.started;
  if (!started) return;
  await Promise.race([started.exited, new Promise((resolve) => setTimeout(resolve, STOP_WAIT_MS))]);
  state.started = null;
};

export { stopStarted };
