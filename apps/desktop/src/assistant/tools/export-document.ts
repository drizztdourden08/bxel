/* @layer renderer-app @kind logic */
import { flattenFrame } from '@bxel/document';
import { hiddenFailure } from '@bxel/mcp';
import type { Failure } from '@bxel/mcp';
import { fileName } from '../../files/file-name';
import { EXPORT_WRITE } from '../../files/files.constants';
import type { ToolContext, ToolHandler } from '../assistant.type';
import { checkRevision } from './check-revision';
import { exportTarget } from './export-target';
import { framePng } from './frame-png';
import { indexHash } from './index-hash';
import { reply } from './reply';
import { spriteFrame } from './sprite-frame';
import type { ExportInput } from './tool-input.type';
import { viewFor } from './view-for';
import { writeProjectFile } from './write-project-file';

const writeExport = async (context: ToolContext, job: ExportInput, path: string, bytes: Uint8Array): Promise<Failure | null> => {
  if (job.location) return writeProjectFile(context, path, bytes, EXPORT_WRITE);
  await context.documents.write(path, bytes, EXPORT_WRITE);
  return null;
};

const exportDocument: ToolHandler = async (input, context) => {
  const job = input as ExportInput;
  const view = viewFor(context, job.documentId);
  if (!view) return reply(hiddenFailure('document'));
  const stale = checkRevision(view, job.expectedRevision);
  if (stale) return reply(stale);
  const target = await exportTarget(job, context);
  if (!target.ok) return reply(target);
  const found = spriteFrame(view.state.artwork, target.value.source.spriteId, target.value.source.frameId);
  if (!found.ok) return reply(found);
  const png = framePng(found.value, job.scale);
  if (!png.ok) return reply(png);
  const refused = await writeExport(context, job, target.value.path, png.value.bytes);
  if (refused) return reply(refused);
  return reply({
    ok: true,
    revision: view.state.revision,
    files: [{ fileName: fileName(target.value.path), bytes: png.value.bytes.length, sha256: await indexHash(png.value.bytes) }],
    indexHash: await indexHash(flattenFrame(found.value.sprite, found.value.frameId)),
  });
};

export { exportDocument };
