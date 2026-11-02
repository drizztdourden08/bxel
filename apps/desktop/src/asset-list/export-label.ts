/* @layer renderer-app @kind logic */
import type { AssetRow } from './asset-list.type';
import { EXPORT_LABELS } from './export-label.constants';

const exportLabel = (row: AssetRow | null, fallback: string): string => (row === null ? fallback : (EXPORT_LABELS[row.kind] ?? fallback));

export { exportLabel };
