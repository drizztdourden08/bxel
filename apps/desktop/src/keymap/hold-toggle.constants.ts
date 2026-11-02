/* @layer renderer-app @kind constants */
import type { ViewToggle } from '../stores/view-store.type';

const HOLD_TAP_MS = 220;

const HOLD_TOGGLES: readonly ViewToggle[] = ['loupe', 'backgroundPreview', 'hideOverlays'];

export { HOLD_TAP_MS, HOLD_TOGGLES };
