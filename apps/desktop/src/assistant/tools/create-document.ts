/* @layer renderer-app @kind logic */
import { engineFailure } from '@bxel/mcp';
import { useAssistantStore } from '../../stores/useAssistantStore';
import type { ToolHandler } from '../assistant.type';
import { reply } from './reply';

const createDocument: ToolHandler = (input, context) => {
  const created = context.host.create(input);
  if (!created.ok) return reply(engineFailure(created.error));
  useAssistantStore.getState().markOpened(created.documentId);
  const revision = context.host.view(created.documentId)?.state.revision ?? 1;
  return reply({ ok: true, documentId: created.documentId, revision });
};

export { createDocument };
