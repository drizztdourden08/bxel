/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import { hiddenFailure, mcpFailure } from '@bxel/mcp';
import { fileName } from '../../files/file-name';
import { EXPORT_WRITE } from '../../files/files.constants';
import { paletteExportBytes } from '../../palette-export/palette-export-bytes';
import { paletteFileOf } from '../../palette-export/palette-file-of';
import type { ToolHandler } from '../assistant.type';
import { bankOf } from './bank-of';
import { checkRevision } from './check-revision';
import { indexHash } from './index-hash';
import type { ExportPaletteInput } from './palette-file-input.type';
import { paletteExportTarget } from './palette-export-target';
import { reply } from './reply';
import { TOOL_TEXT } from './tools.constants';
import { viewFor } from './view-for';
import { writeProjectFile } from './write-project-file';

const exportPalette: ToolHandler = async (input, context) => {
  const job = input as ExportPaletteInput;
  const view = viewFor(context, job.documentId);
  if (!view) return reply(hiddenFailure('document'));
  const stale = checkRevision(view, job.expectedRevision);
  if (stale) return reply(stale);
  const bank = bankOf(context, view, job);
  if (!bank.ok) return reply(bank);
  const file = paletteFileOf(bank.value, job.indexes ?? null);
  if (file.colors.length === 0) return reply(mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.paletteEmpty, { path: 'indexes' }));
  const target = await paletteExportTarget(job, context);
  if (!target.ok) return reply(target);
  const made = paletteExportBytes(file, { extension: job.format, scale: job.format === 'png' ? job.scale : 1 });
  if (!made.ok) return reply(mcpFailure(ERROR_CODE.INVALID_OPTION, made.message));
  if (job.location) {
    const refused = await writeProjectFile(context, target.value, made.bytes, EXPORT_WRITE);
    if (refused) return reply(refused);
  } else {
    await context.documents.write(target.value, made.bytes, EXPORT_WRITE);
  }
  return reply({
    ok: true,
    revision: view.state.revision,
    bankId: bank.value.id,
    colors: file.colors.length,
    files: [{ fileName: fileName(target.value), bytes: made.bytes.length, sha256: await indexHash(made.bytes) }],
  });
};

export { exportPalette };
