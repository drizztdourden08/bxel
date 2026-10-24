/* @layer renderer-app @kind logic */
import type { AssetKind } from '@bxel/document';
import { comparablePath } from '@bxel/project';
import { poolKey } from './pool-key';
import type { DecodedFile, DecodedPool } from './workspace.type';

const poolByPath = (pool: DecodedPool, kind: AssetKind, path: string): DecodedFile | undefined => {
  const place = comparablePath(path);
  return place === undefined ? undefined : pool.byPath.get(poolKey(kind, place));
};

export { poolByPath };
