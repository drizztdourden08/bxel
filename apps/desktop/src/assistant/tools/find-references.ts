/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import { comparablePath } from '@bxel/project';
import type { ToolContext, ToolHandler } from '../assistant.type';
import type { OpenProject } from '../../project/project.type';
import type { IndexedFile, IndexedLink, LinkIndex } from '../../workspace/link-index.type';
import { scanLinkIndex } from '../../workspace/scan-link-index';
import { fileName } from '../../files/file-name';
import { locateInProject } from './locate-in-project';
import { placePath } from './place-path';
import type { FindReferencesInput } from './project-files-input.type';
import { reply } from './reply';
import { TOOL_TEXT } from './tools.constants';
import { visibleProject } from './visible-project';

const stem = (name: string): string => name.replace(/\.[^.]+$/, '');

const referenceOf = (project: OpenProject, file: IndexedFile | null, link: IndexedLink | null) => {
  const found = file ?? link?.found ?? null;
  return {
    assetId: found?.assetId ?? link?.linkId ?? '',
    kind: found?.kind === 'project' ? null : (found?.kind ?? link?.targetKind ?? null),
    name: found?.name ?? stem(link?.targetName ?? ''),
    location: found === null ? null : locateInProject(project, found.path),
    state: link?.state ?? 'ok',
  };
};

const targetOf = (index: LinkIndex, request: FindReferencesInput, wanted: string | null): IndexedFile | undefined =>
  request.assetId !== undefined ? index.files.find((file) => file.assetId === request.assetId) : index.files.find((file) => comparablePath(file.path) === comparablePath(wanted ?? ''));

const findReferences: ToolHandler = async (input, context: ToolContext) => {
  const request = input as FindReferencesInput;
  const scope = visibleProject(context, request.projectId, false);
  if (!scope.ok) return reply(scope);
  const { visible } = scope.value;
  let wanted: string | null = null;
  if (request.file !== undefined) {
    const place = placePath(visible, request.file, 'file');
    if (!place.ok) return reply(place);
    wanted = place.value;
  }
  const index = await scanLinkIndex(context.documents, visible);
  const target = targetOf(index, request, wanted);
  const location = target === undefined ? null : locateInProject(visible, target.path);
  if (!target || !location || target.kind === 'project') return reply(mcpFailure(MCP_ERROR_CODE.FILE_NOT_FOUND, TOOL_TEXT.noEntry, { path: request.file === undefined ? 'assetId' : 'file' }));
  const wantsUsedBy = request.direction !== 'uses';
  const wantsUses = request.direction !== 'usedBy';
  const usedBy = wantsUsedBy ? index.links.filter((link) => link.found?.assetId === target.assetId && link.from.assetId !== target.assetId) : [];
  const uses = wantsUses ? index.links.filter((link) => link.from.assetId === target.assetId) : [];
  return reply({
    ok: true,
    projectId: request.projectId,
    target: { assetId: target.assetId, kind: target.kind, name: target.name || stem(fileName(target.path)), location },
    usedBy: usedBy.filter((link) => locateInProject(visible, link.from.path) !== null).map((link) => referenceOf(visible, link.from, link)),
    uses: uses.map((link) => referenceOf(visible, null, link)),
  });
};

export { findReferences };
