/* @layer renderer-app @kind constants */
import type { PreviewScale, PreviewSettings } from './preview-store.type';

const PREVIEW_SCALES: readonly PreviewScale[] = [1, 2, 4];

const PREVIEW_DEFAULTS: PreviewSettings = { shown: true, scale: 1, onCanvas: true };

export { PREVIEW_DEFAULTS, PREVIEW_SCALES };
