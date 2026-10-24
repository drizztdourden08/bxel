/* @layer core @kind logic */
import { approveForLaunch } from './approve-for-launch';
import { programKey } from './program-key';
import { rememberProgram } from './remember-program';
import type { HelloClient, TrustAnswer, TrustState } from './trust.type';

const applyAnswer = (state: TrustState, client: HelloClient, answer: TrustAnswer, now: string): TrustState => {
  const key = programKey(client.name);
  if (key === null || !answer.remember) return state;
  if (state.store.level === 'ask_once_remember') {
    return { ...state, store: rememberProgram(state.store, client, answer.mode, now) };
  }
  if (state.store.level === 'ask_once_session' && answer.mode !== 'blocked') {
    return { ...state, launch: approveForLaunch(state.launch, key, answer.mode) };
  }
  return state;
};

export { applyAnswer };
