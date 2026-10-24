/* @layer renderer-app @kind logic */
import { comparablePath } from '@bxel/project';
import { poolKey } from './pool-key';
import type { DecodedFile, DecodedPool } from './workspace.type';

const addToPool = (pool: DecodedPool, file: DecodedFile): void => {
  pool.all.push(file);
  const place = comparablePath(file.path);
  const byPath = place === undefined ? undefined : poolKey(file.slice.kind, place);
  if (byPath !== undefined && !pool.byPath.has(byPath)) pool.byPath.set(byPath, file);
  const byId = poolKey(file.slice.kind, file.slice.id);
  if (!pool.byId.has(byId)) pool.byId.set(byId, file);
};

export { addToPool };
