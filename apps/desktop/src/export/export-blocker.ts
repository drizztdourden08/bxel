/* @layer renderer-app @kind logic */
import { EXPORT_TEXT } from './export.constants';
import type { ExportPlan, ExportSettings } from './export.type';

const exportBlocker = (plan: ExportPlan, settings: ExportSettings): string | null =>
  plan.problem ?? (settings.folder.trim() === '' ? EXPORT_TEXT.noFolder : null);

export { exportBlocker };
