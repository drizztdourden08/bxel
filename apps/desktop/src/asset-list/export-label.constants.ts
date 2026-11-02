/* @layer renderer-app @kind constants */
import { KIND_MENU } from './kind-menu.constants';

const EXPORT_LABELS: Readonly<Record<string, string>> = {
  animation: KIND_MENU.exportFrames,
  sheet: KIND_MENU.exportSheet,
  tilemap: KIND_MENU.exportMap,
};

export { EXPORT_LABELS };
