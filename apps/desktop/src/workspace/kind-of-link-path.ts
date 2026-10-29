/* @layer renderer-app @kind logic */
import { ASSET_FORMAT } from '@bxel/document';
import type { AssetKind } from '@bxel/document';
import { LINKABLE_KINDS } from './kind-of-link-path.constants';

const kindOfLinkPath = (path: string): AssetKind | null => {
  const lower = path.toLowerCase();
  return LINKABLE_KINDS.find((kind) => lower.endsWith(ASSET_FORMAT[kind].extension)) ?? null;
};

export { kindOfLinkPath };
