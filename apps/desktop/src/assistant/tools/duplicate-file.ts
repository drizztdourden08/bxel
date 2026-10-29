/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import { copyFileBeside } from '../../asset-list/copy-file-beside';
import { duplicateSteps } from '../../asset-list/duplicate-steps';
import { reasonOf } from '../../files/reason-of';
import { heldAssetsUnder } from '../../file-ops/held-assets';
import { runSteps } from '../../transactions/run-steps';
import type { OpenProject } from '../../project/project.type';
import type { ToolContext, ToolHandler } from '../assistant.type';
import { assetIdsIn } from './asset-ids-in';
import { locateInProject } from './locate-in-project';
import type { DuplicateFileInput, Entry } from './project-files-input.type';
import { reply } from './reply';
import { saveNewAssets } from './save-new-assets';
import { toolKit } from './tool-kit';
import { TOOL_TEXT } from './tools.constants';
import { writeScope } from './write-scope';

const duplicateAsset = async (context: ToolContext, entry: Entry): Promise<readonly string[] | string | null> => {
  const [held] = heldAssetsUnder(entry.path);
  const artwork = held ? context.host.view(held.documentId)?.state.artwork : undefined;
  const plan = held && artwork ? duplicateSteps(artwork, held.key) : null;
  if (!held || !plan) return null;
  const before = assetIdsIn(context, held.documentId);
  const done = runSteps(context.host, held.documentId, TOOL_TEXT.duplicateLabel, plan.steps);
  return done.ok ? saveNewAssets(context, held.documentId, before) : done.error.message;
};

const copyOne = async (context: ToolContext, entry: Entry): Promise<readonly string[] | string> => {
  try {
    return [await copyFileBeside(toolKit(context).documents, entry.path)];
  } catch (error) {
    return reasonOf(error);
  }
};

const created = (visible: OpenProject, from: Entry, paths: readonly string[]) => {
  const source = locateInProject(visible, from.path);
  return paths.flatMap((path) => {
    const to = locateInProject(visible, path);
    return source && to ? [{ from: source, to }] : [];
  });
};

const duplicateFile: ToolHandler = async (input, context) => {
  const request = input as DuplicateFileInput;
  const scope = await writeScope(context, request.projectId, request.files, 'files');
  if (!scope.ok) return reply(scope);
  const made: ReturnType<typeof created> = [];
  for (const entry of scope.value.entries) {
    if (entry.folder) return reply(mcpFailure(MCP_ERROR_CODE.FILE_NOT_SUPPORTED, TOOL_TEXT.filesOnly));
    const paths = (await duplicateAsset(context, entry)) ?? (await copyOne(context, entry));
    if (typeof paths === 'string') return reply(mcpFailure(MCP_ERROR_CODE.WRITE_NOT_ALLOWED, TOOL_TEXT.writeRefused(paths)));
    made.push(...created(scope.value.visible, entry, paths));
  }
  return reply({ ok: true, projectId: request.projectId, created: made });
};

export { duplicateFile };
