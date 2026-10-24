/* @layer renderer-app @kind logic */
import type { AssetKey, AssetKind } from '@bxel/document';
import { isSamePath } from '@bxel/project';

const keyAt = (paths: ReadonlyMap<string, string>, path: string, kind: AssetKind): AssetKey | null => {
  const id = [...paths].find(([, known]) => isSamePath(known, path))?.[0];
  return id === undefined ? null : { kind, id };
};

export { keyAt };
