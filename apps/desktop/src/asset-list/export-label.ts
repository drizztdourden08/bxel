/* @layer renderer-app @kind logic */
import type { AssetRow } from './asset-list.type';
import { KIND_MENU } from './kind-menu.constants';

const EXPORT_LABELS: Readonly<Record<string, string>> = {
  animation: KIND_MENU.exportFrames,
  sheet: KIND_MENU.exportSheet,
  tilemap: KIND_MENU.exportMap,
};

const exportLabel = (row: AssetRow | null, fallback: string): string => (row === null ? fallback : (EXPORT_LABELS[row.kind] ?? fallback));

export { exportLabel };
