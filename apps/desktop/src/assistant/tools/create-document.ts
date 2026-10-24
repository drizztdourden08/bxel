/* @layer renderer-app @kind logic */
import { engineFailure } from '@bxel/mcp';
import { useAssistantStore } from '../../stores/useAssistantStore';
import { runSteps } from '../../transactions/run-steps';
import type { ToolHandler } from '../assistant.type';
import { created } from './created-asset';
import { createSteps } from './create-steps';
import { SHEET_SPRITE_SIZE } from './create-steps.constants';
import { reply } from './reply';
import type { CreateInput } from './tool-input.type';

const baseOptions = (request: CreateInput): Record<string, unknown> => {
  const { kind, tileSize: _tileSize, mapSize: _mapSize, sprite, ...rest } = request;
  const first = kind === 'sheet' ? (sprite ?? { name: request.name, ...SHEET_SPRITE_SIZE }) : sprite;
  return kind === 'sprite' || kind === 'sheet' ? { ...rest, ...(first ? { sprite: first } : {}) } : rest;
};

const createDocument: ToolHandler = (input, context) => {
  const request = input as CreateInput;
  const made = context.host.create(baseOptions(request));
  if (!made.ok) return reply(engineFailure(made.error));
  const { documentId } = made;
  const artwork = context.host.view(documentId)?.state.artwork;
  const steps = artwork ? createSteps(request, artwork) : [];
  if (steps.length > 0) {
    const ran = runSteps(context.host, documentId, request.name, steps);
    if (!ran.ok) {
      context.host.close(documentId);
      return reply(engineFailure(ran.error));
    }
  }
  useAssistantStore.getState().markOpened(documentId);
  const view = context.host.view(documentId);
  return reply({ ok: true, documentId, revision: view?.state.revision ?? 1, asset: view ? created(view.state.artwork, request) : null });
};

export { createDocument };
