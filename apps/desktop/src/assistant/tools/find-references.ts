/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { OpenProject } from '../../project/project.type';
import type { IndexedFile, IndexedLink } from '../../workspace/link-index.type';
import { scanLinkIndex } from '../../workspace/scan-link-index';
import type { ToolHandler } from '../assistant.type';
import { locateInProject } from './locate-in-project';
import { placePath } from './place-path';
import type { FindReferencesInput } from './project-files-input.type';
import { reference } from './reference';
import { reply } from './reply';
import { referenceTarget } from './reference-target';
import { TOOL_TEXT } from './tools.constants';
import { visibleProject } from './visible-project';

const usedByOf = (links: readonly IndexedLink[], target: IndexedFile, visible: OpenProject, wanted: boolean) =>
  links
    .filter((link) => wanted && link.found?.assetId === target.assetId && link.from.assetId !== target.assetId && locateInProject(visible, link.from.path) !== null)
    .map((link) => reference(visible, link.from, link));

const usesOf = (links: readonly IndexedLink[], target: IndexedFile, visible: OpenProject, wanted: boolean) =>
  links.filter((link) => wanted && link.from.assetId === target.assetId).map((link) => reference(visible, null, link));

const findReferences: ToolHandler = async (input, context) => {
  const request = input as FindReferencesInput;
  const scope = visibleProject(context, request.projectId, false);
  if (!scope.ok) return reply(scope);
  const { visible } = scope.value;
  const place = request.file === undefined ? { ok: true as const, value: null } : placePath(visible, request.file, 'file');
  if (!place.ok) return reply(place);
  const index = await scanLinkIndex(context.documents, visible);
  const target = referenceTarget(index, request, place.value);
  const location = target === undefined ? null : locateInProject(visible, target.path);
  if (!target || !location) return reply(mcpFailure(MCP_ERROR_CODE.FILE_NOT_FOUND, TOOL_TEXT.noEntry, { path: request.file === undefined ? 'assetId' : 'file' }));
  return reply({
    ok: true,
    projectId: request.projectId,
    target: { assetId: target.assetId, kind: target.kind, name: target.name, location },
    usedBy: usedByOf(index.links, target, visible, request.direction !== 'uses'),
    uses: usesOf(index.links, target, visible, request.direction !== 'usedBy'),
  });
};

export { findReferences };
