/* @layer electron-main @kind logic */
import { programKey, sessionModeOf } from '@bxel/mcp';
import type { HelloClient, PairOutcome } from '@bxel/mcp';
import { HANDOFF_MAX_AGE_MS } from './restart-handoff.constants';
import type { AssistantMain } from './assistant.type';

const inheritedPairing = (state: Pick<AssistantMain, 'handoff'>, client: HelloClient, now: number = Date.now()): PairOutcome | null => {
  const handoff = state.handoff;
  if (handoff === null) return null;
  state.handoff = null;
  if (now - handoff.at > HANDOFF_MAX_AGE_MS || now < handoff.at) return null;
  if (programKey(client.name) !== handoff.key) return null;
  return { ok: true, mode: sessionModeOf(handoff.grant), grant: handoff.grant, trust: 'this_launch' };
};

export { inheritedPairing };
