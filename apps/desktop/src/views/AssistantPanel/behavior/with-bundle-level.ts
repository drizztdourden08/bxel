/* @layer renderer-app @kind logic */
import type { BundleId, Grant, Level } from '@bxel/mcp';

const withBundleLevel = (grant: Grant, bundle: BundleId, level: Level): Grant => ({ ...grant, bundles: { ...grant.bundles, [bundle]: level } });

export { withBundleLevel };
