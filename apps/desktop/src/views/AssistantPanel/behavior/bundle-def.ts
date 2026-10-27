/* @layer renderer-app @kind logic */
import { BUNDLES } from '@bxel/mcp';
import type { BundleDef, BundleId } from '@bxel/mcp';

const bundleDef = (id: BundleId): BundleDef => {
  const found = BUNDLES.find((bundle) => bundle.id === id);
  if (!found) throw new Error(`unknown bundle ${id}`);
  return found;
};

export { bundleDef };
