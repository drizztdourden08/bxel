/* @layer renderer-app @kind logic */
import { applyAnswer, decideTrust, grantOfChoice, MCP_ERROR_CODE, mcpFailure, sessionModeOf, touchProgram } from '@bxel/mcp';
import type { PairChoice, PairOutcome, PairRequest } from '@bxel/mcp';
import { useAssistantStore } from '../stores/useAssistantStore';
import { ASSISTANT_TEXT } from './assistant.constants';
import type { SettingsPort } from './assistant.type';
import { askOwner } from './ask-owner';
import { trustStoreOf } from './trust-store-of';

const denied = (): PairOutcome => mcpFailure(MCP_ERROR_CODE.PAIRING_DENIED, ASSISTANT_TEXT.denied);

const rememberChoice = (port: SettingsPort, request: PairRequest, choice: PairChoice, remember: boolean): void => {
  const store = useAssistantStore.getState();
  const state = { store: trustStoreOf(port.read()), launch: store.launch };
  const next = applyAnswer(state, request.client, { choice, remember }, new Date().toISOString());
  if (next.launch !== state.launch) store.setLaunch(next.launch);
  if (next.store !== state.store) port.patch({ assistantPrograms: next.store.programs });
};

const answerPair = async (request: PairRequest): Promise<PairOutcome> => {
  const port = useAssistantStore.getState().port;
  if (!port) return mcpFailure(MCP_ERROR_CODE.APP_BUSY, ASSISTANT_TEXT.starting);
  const settings = port.read();
  if (!settings.assistantAccess) return mcpFailure(MCP_ERROR_CODE.MCP_DISABLED, ASSISTANT_TEXT.disabled);
  const trust = trustStoreOf(settings);
  const decision = decideTrust(request.client, trust, useAssistantStore.getState().launch);
  if (decision.kind === 'deny') return denied();
  if (decision.kind === 'pair') {
    if (decision.trust === 'remembered') port.patch({ assistantPrograms: touchProgram(trust, request.client, new Date().toISOString()).programs });
    return { ok: true, mode: decision.mode, grant: decision.grant, trust: decision.trust };
  }
  const choice = await askOwner(request.client, request.headless);
  rememberChoice(port, request, choice, decision.remember !== 'none');
  if (choice === 'blocked') return denied();
  const grant = grantOfChoice(choice);
  return { ok: true, mode: sessionModeOf(grant), grant, trust: 'prompted' };
};

export { answerPair };
