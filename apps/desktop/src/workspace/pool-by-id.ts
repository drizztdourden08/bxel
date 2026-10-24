/* @layer renderer-app @kind logic */
import type { AssetKind } from '@bxel/document';
import { poolKey } from './pool-key';
import type { DecodedFile, DecodedPool } from './workspace.type';

const poolById = (pool: DecodedPool, kind: AssetKind, id: string): DecodedFile | undefined => pool.byId.get(poolKey(kind, id));

export { poolById };
