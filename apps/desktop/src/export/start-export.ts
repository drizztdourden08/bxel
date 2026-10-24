/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { getPlatform, jobs, toast } from '@drizztdourden08/brock-react';
import { EXPORT_WRITE } from '../files/files.constants';
import { exportBlocker } from './export-blocker';
import { EXPORT_JOB_ID, EXPORT_STEPS, EXPORT_TEXT } from './export.constants';
import type { ExportRequest, ExportResult, ExportRun, ExportSink } from './export.type';
import { planExport } from './plan-export';
import { reportExport } from './report-export';
import { runExport } from './run-export';
import { useExportStore } from './useExportStore';

const sinkOf = (documents: DocumentsPort): ExportSink => ({
  writeBytes: (path, bytes) => documents.write(path, bytes, EXPORT_WRITE),
  writeText: (path, text) => documents.writeText(path, text, EXPORT_WRITE),
});

const runAsJob = async (sink: ExportSink, run: ExportRun): Promise<ExportResult> => {
  const handle = jobs.start(EXPORT_JOB_ID, EXPORT_STEPS, { title: EXPORT_TEXT.jobTitle(run.title), cancellable: true });
  const held: { result: ExportResult } = {
    result: { kind: 'failed', message: EXPORT_TEXT.unknownReason, written: 0 },
  };
  await handle
    .run(async (job) => {
      held.result = await runExport(job, sink, run);
      if (held.result.kind === 'failed') throw new Error(held.result.message);
    })
    .catch(() => undefined);
  return held.result;
};

const startExport = async (request: ExportRequest): Promise<void> => {
  const { documents } = getPlatform();
  const store = useExportStore.getState();
  if (!documents) {
    toast(EXPORT_TEXT.failed(EXPORT_TEXT.unavailable), { variant: 'danger' });
    return;
  }
  if (store.running) {
    toast(EXPORT_TEXT.busy, { variant: 'info' });
    return;
  }
  const plan = planExport(request);
  const blocker = exportBlocker(plan, request.settings);
  if (blocker !== null) {
    toast(blocker, { variant: 'danger' });
    return;
  }
  store.setRunning(true);
  try {
    const result = await runAsJob(sinkOf(documents), { plan, folder: request.settings.folder, title: request.title });
    reportExport(result, request.settings.folder);
  } finally {
    store.setRunning(false);
  }
};

export { startExport };
