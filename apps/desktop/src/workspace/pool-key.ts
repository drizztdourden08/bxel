/* @layer renderer-app @kind logic */
import type { AssetKind } from '@bxel/document';

const poolKey = (kind: AssetKind, value: string): string => `${kind}|${value}`;

export { poolKey };
