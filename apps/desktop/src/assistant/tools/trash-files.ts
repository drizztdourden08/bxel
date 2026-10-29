/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import { referrerPaths } from '../../file-ops/referrer-paths';
import { trashPath } from '../../file-ops/trash-paths';
import type { ToolHandler } from '../assistant.type';
import { locateInProject } from './locate-in-project';
import type { TrashFilesInput } from './project-files-input.type';
import { reply } from './reply';
import { referrersVisible } from './referrers-visible';
import { resolveEntries } from './resolve-entries';
import { TOOL_TEXT } from './tools.constants';
import { visibleProject } from './visible-project';

const trashFiles: ToolHandler = async (input, context) => {
  const request = input as TrashFilesInput;
  const scope = visibleProject(context, request.projectId, true);
  if (!scope.ok) return reply(scope);
  const { visible } = scope.value;
  const entries = await resolveEntries(context, visible, request.files, 'files');
  if (!entries.ok) return reply(entries);
  const paths = entries.value.map((each) => each.path);
  const users = referrerPaths(paths);
  if (users.length > 0 && !request.breakLinks) {
    const names = users.flatMap((path) => locateInProject(visible, path)?.path ?? []);
    return reply(mcpFailure(MCP_ERROR_CODE.FILE_IN_USE, `${TOOL_TEXT.linksStillUsed(users.length)} ${names.join(', ')}`));
  }
  const hidden = referrersVisible(visible, paths);
  if (hidden) return reply(hidden);
  for (const path of paths) {
    const done = await trashPath(path);
    if (!done.ok) return reply(mcpFailure(MCP_ERROR_CODE.WRITE_NOT_ALLOWED, TOOL_TEXT.writeRefused(done.message)));
  }
  return reply({
    ok: true,
    projectId: request.projectId,
    trashed: paths.flatMap((path) => locateInProject(visible, path) ?? []),
    brokenLinksIn: users.flatMap((path) => locateInProject(visible, path) ?? []),
  });
};

export { trashFiles };
