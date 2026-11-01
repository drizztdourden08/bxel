/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import { hiddenFailure, mcpFailure } from '@bxel/mcp';
import { fileName } from '../../files/file-name';
import { importPlan } from '../../palette-import/import-plan';
import { readPaletteFile } from '../../palette-source/read-palette-file';
import type { ToolHandler } from '../assistant.type';
import { bankOf } from './bank-of';
import { checkRevision } from './check-revision';
import type { ImportPaletteInput } from './palette-file-input.type';
import { paletteFilePath } from './palette-file-path';
import { reply } from './reply';
import { runEdits } from './run-edits';
import { toolKit } from './tool-kit';
import { TOOL_TEXT } from './tools.constants';
import { viewFor } from './view-for';

const importPaletteBank: ToolHandler = async (input, context) => {
  const job = input as ImportPaletteInput;
  const view = viewFor(context, job.documentId);
  if (!view) return reply(hiddenFailure('document'));
  const stale = checkRevision(view, job.expectedRevision);
  if (stale) return reply(stale);
  const bank = bankOf(context, view, job);
  if (!bank.ok) return reply(bank);
  const path = await paletteFilePath(context, job.file);
  if (!path.ok) return reply(path);
  const read = readPaletteFile(await toolKit(context).documents.read(path.value), fileName(path.value));
  if (!read.ok) return reply(mcpFailure(ERROR_CODE.INVALID_OPTION, read.message, { path: 'file.path' }));
  const plan = importPlan(bank.value, read.palette.colors, job.mode);
  const counts = { added: plan.kept.length, present: plan.present.length, over: plan.over.length };
  const summary = { bankId: bank.value.id, mode: job.mode, ...counts };
  if (plan.steps.length === 0) return reply({ ok: true, revision: view.state.revision, ...summary });
  const steps = plan.steps.map(({ name, targets, options }) => ({ name, targets, options }));
  const edit = { documentId: job.documentId, baseRevision: view.state.revision, label: TOOL_TEXT.paletteImportLabel, steps };
  const done = runEdits(edit, context, 'commit');
  return reply(done.outcome.ok ? { ok: true, revision: Number(Reflect.get(done.outcome, 'revision')), ...summary } : done.outcome);
};

export { importPaletteBank };
