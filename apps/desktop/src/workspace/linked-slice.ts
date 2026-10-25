/* @layer renderer-app @kind logic */
import { resolveLinkPath } from '@bxel/document';
import type { AssetKind } from '@bxel/document';
import { poolById } from './pool-by-id';
import { poolByPath } from './pool-by-path';
import type { AssetFile, DecodedPool, LinkedSlice } from './workspace.type';

const linkedSlice = (file: AssetFile, pool: DecodedPool, kind: AssetKind): LinkedSlice => {
  for (const link of file.manifest.links) {
    const byPath = poolByPath(pool, kind, resolveLinkPath(file.path, link.path));
    if (byPath) return { found: byPath, relinked: false };
    const byId = poolById(pool, kind, link.id);
    if (byId) return { found: byId, relinked: true };
  }
  return { found: null, relinked: false };
};

export { linkedSlice };
