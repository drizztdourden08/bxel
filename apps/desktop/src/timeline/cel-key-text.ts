/* @layer renderer-app @kind logic */
import type { CelKey } from '../stores/timeline-store.type';

const celKeyText = (key: CelKey): string => `${key.layerId}:${key.frameId}`;

export { celKeyText };
