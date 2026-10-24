/* @layer renderer-app @kind logic */
import { EXPORT_CANCELLED, EXPORT_TEXT } from './export.constants';
import type { ExportJob, ExportResult, ExportRun, MadeEntry } from './export.type';

const makeAll = (job: ExportJob, run: ExportRun): MadeEntry[] | ExportResult => {
  const { plan, title } = run;
  const made: MadeEntry[] = [];
  job.step('render', EXPORT_TEXT.jobLine(title, 0, plan.spriteCount));
  for (const [index, file] of plan.files.entries()) {
    if (job.signal.aborted) return EXPORT_CANCELLED;
    const result = file.make();
    if (!result.ok) return { kind: 'failed', message: result.message, written: 0 };
    made.push({ file, data: result.data });
    job.progress((index + 1) / plan.files.length, EXPORT_TEXT.jobLine(title, file.spriteIndex + 1, plan.spriteCount));
  }
  return job.signal.aborted ? EXPORT_CANCELLED : made;
};

export { makeAll };
