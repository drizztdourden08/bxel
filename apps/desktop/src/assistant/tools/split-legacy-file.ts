/* @layer renderer-app @kind logic */
import { splitIntoAssets } from '@bxel/document';
import { checkProjectAccess, checkWrite, effectiveAccess, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import { entryKindOf } from '@bxel/project';
import { readArtworkFile } from '../../files/read-artwork-file';
import { projectDirs } from '../../workspace/project-dirs';
import { splitPaths } from '../../workspace/split-paths';
import { writeSplit } from '../../workspace/write-split';
import type { ToolHandler } from '../assistant.type';
import { fileExists } from './file-exists';
import { projectFolder } from './project-folder';
import { projectPath } from './project-path';
import { reply } from './reply';
import { splitReport } from './split-report';
import type { SplitInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { toolKit } from './tool-kit';

const splitLegacyFile: ToolHandler = async (input, context) => {
  const { file } = input as SplitInput;
  const found = projectFolder(context, file.projectId, file.folderId);
  if (!found.ok) return reply(found);
  const denied =
    checkProjectAccess(effectiveAccess(context.call.session.mode, found.value.access), 'edit') ?? checkWrite(context.settings.assistantWrite, 'project_file');
  if (denied) return reply(denied);
  const path = projectPath(found.value.folder.path, file.path);
  if (!path.ok) return reply(path);
  if (entryKindOf(file.path) !== 'legacy') return reply(mcpFailure(MCP_ERROR_CODE.FILE_NOT_SUPPORTED, TOOL_TEXT.onlyOlderFiles, { path: 'file.path' }));
  if (!(await fileExists(context.documents, path.value))) return reply(mcpFailure(MCP_ERROR_CODE.FILE_NOT_FOUND, TOOL_TEXT.noFile, { path: 'file.path' }));
  const read = await readArtworkFile(context.documents, path.value);
  const artwork = 'report' in read ? read.report.artwork : null;
  if (!artwork) return reply(mcpFailure(MCP_ERROR_CODE.FILE_NOT_SUPPORTED, TOOL_TEXT.notReadable, { path: 'file.path' }));
  const plan = splitIntoAssets(artwork);
  const paths = await splitPaths(context.documents, plan, projectDirs(found.value.project));
  await writeSplit(toolKit(context), artwork, plan, paths);
  return reply(splitReport(found.value.project, plan, paths));
};

export { splitLegacyFile };
