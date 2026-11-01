/* @layer renderer-app @kind logic */
import { flattenFrame } from '@bxel/document';
import type { ToolReply } from '@bxel/mcp';
import { fileName } from '../../files/file-name';
import type { DocumentView } from '../../documents/document-host.type';
import type { ToolContext, ToolHandler } from '../assistant.type';
import { checkedView } from './checked-view';
import { exportedAnimation } from './export-animation';
import { exportTarget } from './export-target';
import { framePng } from './frame-png';
import { hiddenAssets } from './hidden-assets';
import { indexHash } from './index-hash';
import { isReply } from './is-reply';
import { reply } from './reply';
import { spriteFrame } from './sprite-frame';
import { sheetJson } from './sheet-json';
import { sheetPng } from './sheet-png';
import { storeExportFile } from './store-export-file';
import type { AnimationSource, ExportInput, SheetSource } from './tool-input.type';

const exportAnimation = async (context: ToolContext, view: DocumentView, job: ExportInput, target: { readonly path: string; readonly source: AnimationSource }): Promise<ToolReply> => {
  const made = await exportedAnimation(context, view, job, target.source);
  if (!made.ok) return reply(made);
  const refused = await storeExportFile(context, job, target.path, made.value.file.bytes);
  if (refused) return reply(refused);
  return reply({
    ok: true,
    revision: view.state.revision,
    files: [{ fileName: fileName(target.path), bytes: made.value.file.bytes.length, sha256: await indexHash(made.value.file.bytes) }],
    indexHash: made.value.hash,
  });
};

const exportSheet = async (
  context: ToolContext,
  view: DocumentView,
  job: ExportInput,
  target: { readonly path: string; readonly source: SheetSource },
): Promise<ToolReply> => {
  const picture = { artwork: view.state.artwork, revision: view.state.revision, sheetId: target.source.sheetId, scale: job.scale, hidden: hiddenAssets(context, job.documentId) };
  const made = job.format === 'atlas-json' ? sheetJson(picture) : sheetPng(picture);
  if (!made.ok) return reply(made);
  const bytes = 'bytes' in made.value ? made.value.bytes : made.value;
  const refused = await storeExportFile(context, job, target.path, bytes);
  if (refused) return reply(refused);
  const sha256 = await indexHash(bytes);
  return reply({
    ok: true,
    revision: view.state.revision,
    files: [{ fileName: fileName(target.path), bytes: bytes.length, sha256 }],
    indexHash: sha256,
  });
};

const exportDocument: ToolHandler = async (input, context) => {
  const job = input as ExportInput;
  const view = checkedView(context, job.documentId, job.expectedRevision);
  if (isReply(view)) return view;
  const target = await exportTarget(job, context);
  if (!target.ok) return reply(target);
  const { source } = target.value;
  if ('animationId' in source) return exportAnimation(context, view, job, { path: target.value.path, source });
  if ('sheetId' in source) return exportSheet(context, view, job, { path: target.value.path, source });
  const found = spriteFrame(view.state.artwork, source.spriteId, source.frameId, hiddenAssets(context, job.documentId));
  if (!found.ok) return reply(found);
  const png = framePng(found.value, job.scale, job.format === 'png-indexed');
  if (!png.ok) return reply(png);
  const refused = await storeExportFile(context, job, target.value.path, png.value.bytes);
  if (refused) return reply(refused);
  return reply({
    ok: true,
    revision: view.state.revision,
    files: [{ fileName: fileName(target.value.path), bytes: png.value.bytes.length, sha256: await indexHash(png.value.bytes) }],
    indexHash: await indexHash(flattenFrame(found.value.sprite, found.value.frameId)),
  });
};

export { exportDocument };
