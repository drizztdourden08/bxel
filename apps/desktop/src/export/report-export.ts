/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { EXPORT_TEXT } from './export.constants';
import type { ExportResult } from './export.type';

const reportExport = (result: ExportResult, folder: string): void => {
  if (result.kind === 'done') {
    toast(EXPORT_TEXT.exported(result.count, folder), { variant: 'success' });
  } else if (result.kind === 'failed') {
    const message = result.written === 0 ? EXPORT_TEXT.failed(result.message) : EXPORT_TEXT.failedPartly(result.message, result.written);
    toast(message, { variant: 'danger' });
  }
};

export { reportExport };
