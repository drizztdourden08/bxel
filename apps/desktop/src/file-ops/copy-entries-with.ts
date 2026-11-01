/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { reasonOf } from '../files/reason-of';
import type { CopyOutcome } from './file-ops.type';
import { planCopiesIn } from './plan-copies-in';
import { relinkCopies } from './relink-copies';

const copyEntriesWith = async (documents: DocumentsPort, paths: readonly string[], toFolder: string): Promise<CopyOutcome> => {
  const plan = await planCopiesIn(documents, paths, toFolder);
  if (typeof plan === 'string') return { ok: false, message: plan };
  try {
    for (const folder of plan.folders) await documents.mkdir(folder);
    for (const file of plan.files) await documents.copy(file.from, file.to);
    return { ok: true, copied: plan.files.length, relinked: await relinkCopies(documents, plan.files) };
  } catch (error) {
    return { ok: false, message: reasonOf(error) };
  }
};

export { copyEntriesWith };
