/* @layer renderer-app @kind logic */
import { flattenFrame } from '@bxel/document';
import { hiddenFailure } from '@bxel/mcp';
import type { Failure, ToolReply } from '@bxel/mcp';
import { fileName } from '../../files/file-name';
import { EXPORT_WRITE } from '../../files/files.constants';
import type { DocumentView } from '../../documents/document-host.type';
import type { ToolContext, ToolHandler } from '../assistant.type';
import { checkRevision } from './check-revision';
import { exportedAnimation } from './export-animation';
import { exportTarget } from './export-target';
import { framePng } from './frame-png';
import { hiddenAssets } from './hidden-assets';
import { indexHash } from './index-hash';
import { reply } from './reply';
import { spriteFrame } from './sprite-frame';
import type { AnimationSource, ExportInput } from './tool-input.type';
import { viewFor } from './view-for';
import { writeProjectFile } from './write-project-file';

const writeExport = async (context: ToolContext, job: ExportInput, path: string, bytes: Uint8Array): Promise<Failure | null> => {
  if (job.location) return writeProjectFile(context, path, bytes, EXPORT_WRITE);
  await context.documents.write(path, bytes, EXPORT_WRITE);
  return null;
};

const exportAnimation = async (context: ToolContext, view: DocumentView, job: ExportInput, target: { readonly path: string; readonly source: AnimationSource }): Promise<ToolReply> => {
  const made = await exportedAnimation(context, view, job, target.source);
  if (!made.ok) return reply(made);
  const refused = await writeExport(context, job, target.path, made.value.file.bytes);
  if (refused) return reply(refused);
  return reply({
    ok: true,
    revision: view.state.revision,
    files: [{ fileName: fileName(target.path), bytes: made.value.file.bytes.length, sha256: await indexHash(made.value.file.bytes) }],
    indexHash: made.value.hash,
  });
};

const exportDocument: ToolHandler = async (input, context) => {
  const job = input as ExportInput;
  const view = viewFor(context, job.documentId);
  if (!view) return reply(hiddenFailure('document'));
  const stale = checkRevision(view, job.expectedRevision);
  if (stale) return reply(stale);
  const target = await exportTarget(job, context);
  if (!target.ok) return reply(target);
  const { source } = target.value;
  if ('animationId' in source) return exportAnimation(context, view, job, { path: target.value.path, source });
  const found = spriteFrame(view.state.artwork, source.spriteId, source.frameId, hiddenAssets(context, job.documentId));
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
