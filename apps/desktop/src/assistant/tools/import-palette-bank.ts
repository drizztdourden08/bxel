/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import { mcpFailure } from '@bxel/mcp';
import { fileName } from '../../files/file-name';
import { importPlan } from '../../palette-import/import-plan';
import { readPaletteFile } from '../../palette-source/read-palette-file';
import type { ToolHandler } from '../assistant.type';
import { isReply } from './is-reply';
import type { ImportPaletteInput } from './palette-file-input.type';
import { paletteFilePath } from './palette-file-path';
import { paletteJobView } from './palette-job-view';
import { reply } from './reply';
import { runEdits } from './run-edits';
import { toolKit } from './tool-kit';
import { TOOL_TEXT } from './tools.constants';

const importPaletteBank: ToolHandler = async (input, context) => {
  const job = input as ImportPaletteInput;
  const opened = paletteJobView(context, job);
  if (isReply(opened)) return opened;
  const { view, bank } = opened;
  const path = await paletteFilePath(context, job.file);
  if (!path.ok) return reply(path);
  const read = readPaletteFile(await toolKit(context).documents.read(path.value), fileName(path.value));
  if (!read.ok) return reply(mcpFailure(ERROR_CODE.INVALID_OPTION, read.message, { path: 'file.path' }));
  const plan = importPlan(bank, read.palette.colors, job.mode);
  const counts = { added: plan.kept.length, present: plan.present.length, over: plan.over.length };
  const summary = { bankId: bank.id, mode: job.mode, ...counts };
  if (plan.steps.length === 0) return reply({ ok: true, revision: view.state.revision, ...summary });
  const steps = plan.steps.map(({ name, targets, options }) => ({ name, targets, options }));
  const edit = { documentId: job.documentId, baseRevision: view.state.revision, label: TOOL_TEXT.paletteImportLabel, steps };
  const done = runEdits(edit, context, 'commit');
  return reply(done.outcome.ok ? { ok: true, revision: Number(Reflect.get(done.outcome, 'revision')), ...summary } : done.outcome);
};

export { importPaletteBank };
