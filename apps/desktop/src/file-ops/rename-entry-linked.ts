/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { fileName } from '../files/file-name';
import { FILE_OPS_TEXT } from './file-ops.constants';
import type { OpOutcome } from './file-ops.type';
import { planRename } from './plan-rename';
import { relocate } from './relocate';

const renameEntryLinked = async (path: string, typed: string, isFolder: boolean): Promise<OpOutcome> => {
  const plan = await planRename(path, typed, isFolder);
  if (plan === null) return { ok: true, rewritten: 0 };
  if (typeof plan === 'string') return { ok: false, message: plan };
  const outcome = await relocate([plan]);
  if (outcome.ok) toast(FILE_OPS_TEXT.renamed(fileName(plan.to)), { variant: 'success', action: { label: FILE_OPS_TEXT.undo, onSelect: () => void relocate([{ from: plan.to, to: plan.from }]) } });
  return outcome;
};

export { renameEntryLinked };
