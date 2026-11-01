/* @layer renderer-app @kind logic */
import type { Failure } from '@bxel/mcp';
import { EXPORT_WRITE } from '../../files/files.constants';
import type { ToolContext } from '../assistant.type';
import type { ExportPaletteInput } from './palette-file-input.type';
import { writeProjectFile } from './write-project-file';

const storePaletteExport = async (context: ToolContext, job: ExportPaletteInput, path: string, bytes: Uint8Array): Promise<Failure | null> => {
  if (job.location) return writeProjectFile(context, path, bytes, EXPORT_WRITE);
  await context.documents.write(path, bytes, EXPORT_WRITE);
  return null;
};

export { storePaletteExport };
