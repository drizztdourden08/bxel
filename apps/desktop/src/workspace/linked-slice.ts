/* @layer renderer-app @kind logic */
import { resolveLinkPath } from '@bxel/document';
import type { AssetKind } from '@bxel/document';
import { isSamePath } from '@bxel/project';
import type { AssetFile, DecodedFile, LinkedSlice } from './workspace.type';

const linkedSlice = (file: AssetFile, pool: readonly DecodedFile[], kind: AssetKind): LinkedSlice => {
  const ofKind = pool.filter((each) => each.slice.kind === kind);
  for (const link of file.manifest.links) {
    const path = resolveLinkPath(file.path, link.path);
    const byPath = ofKind.find((each) => isSamePath(each.path, path));
    if (byPath) return { found: byPath, relinked: false };
    const byId = ofKind.find((each) => each.slice.id === link.id);
    if (byId) return { found: byId, relinked: true };
  }
  return { found: null, relinked: false };
};

export { linkedSlice };
