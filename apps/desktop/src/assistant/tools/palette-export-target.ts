/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import { mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import { paletteNameProblem } from '../../palette-export/palette-name-problem';
import { folderTarget } from './folder-target';
import type { ExportPaletteInput } from './palette-file-input.type';
import { projectWriteTarget } from './project-write-target';

const paletteExportTarget = async (job: ExportPaletteInput, context: ToolContext): Promise<McpResult<string>> => {
  const name = job.location?.path ?? job.fileName ?? '';
  const problem = paletteNameProblem(job.format, name);
  if (problem !== null) return mcpFailure(ERROR_CODE.INVALID_OPTION, problem, { path: job.location ? 'location.path' : 'fileName' });
  if (!job.location) return folderTarget(job, context);
  const kind = job.format === 'png' ? 'png' : 'palette';
  return projectWriteTarget(context, { location: job.location, kind, overwrite: job.overwrite ?? false });
};

export { paletteExportTarget };
