/* @layer renderer-app @kind logic */
import { EXPORT_TEXT } from './export.constants';
import type { ExportSettings, IndexedStatus } from './export.type';
import { wantsMap } from './wants-map';

const colourProblem = (settings: ExportSettings, indexed: IndexedStatus): string | null => {
  if (!wantsMap(settings)) return null;
  if (indexed.state === 'unavailable') return indexed.note;
  return indexed.needsApproval && !settings.approved ? EXPORT_TEXT.needApproval : null;
};

export { colourProblem };
