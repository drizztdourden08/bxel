/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import { mcpFailure } from '@bxel/mcp';
import { fileName } from '../../files/file-name';
import { paletteExportBytes } from '../../palette-export/palette-export-bytes';
import { paletteFileOf } from '../../palette-export/palette-file-of';
import type { ToolHandler } from '../assistant.type';
import { indexHash } from './index-hash';
import { isReply } from './is-reply';
import { paletteExportTarget } from './palette-export-target';
import type { ExportPaletteInput } from './palette-file-input.type';
import { paletteJobView } from './palette-job-view';
import { reply } from './reply';
import { storeExportFile } from './store-export-file';
import { TOOL_TEXT } from './tools.constants';

const exportPalette: ToolHandler = async (input, context) => {
  const job = input as ExportPaletteInput;
  const opened = paletteJobView(context, job);
  if (isReply(opened)) return opened;
  const { view, bank } = opened;
  const file = paletteFileOf(bank, job.indexes ?? null);
  if (file.colors.length === 0) return reply(mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.paletteEmpty, { path: 'indexes' }));
  const target = await paletteExportTarget(job, context);
  if (!target.ok) return reply(target);
  const made = paletteExportBytes(file, { extension: job.format, scale: job.format === 'png' ? job.scale : 1 });
  if (!made.ok) return reply(mcpFailure(ERROR_CODE.INVALID_OPTION, made.message));
  const refused = await storeExportFile(context, job, target.value, made.bytes);
  if (refused) return reply(refused);
  return reply({
    ok: true,
    revision: view.state.revision,
    bankId: bank.id,
    colors: file.colors.length,
    files: [{ fileName: fileName(target.value), bytes: made.bytes.length, sha256: await indexHash(made.bytes) }],
  });
};

export { exportPalette };
