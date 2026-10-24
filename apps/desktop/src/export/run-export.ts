/* @layer renderer-app @kind logic */
import { EXPORT_TEXT } from './export.constants';
import type { ExportJob, ExportResult, ExportRun, ExportSink } from './export.type';
import { makeAll } from './make-all';
import { writeAll } from './write-all';

const runExport = async (job: ExportJob, sink: ExportSink, run: ExportRun): Promise<ExportResult> => {
  const made = makeAll(job, run);
  if (!Array.isArray(made)) return made;
  job.setCancellable(false);
  job.step('write', EXPORT_TEXT.jobTitle(run.title));
  return writeAll(sink, run.folder, made);
};

export { runExport };
