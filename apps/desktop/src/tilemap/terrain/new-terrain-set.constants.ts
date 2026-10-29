/* @layer renderer-app @kind constants */
import type { TerrainKind } from '@bxel/document';

const KIND_NAMES: Readonly<Record<TerrainKind, string>> = { blob16: 'Edge', corner16: 'Corner', blob47: 'Blob' };

export { KIND_NAMES };
