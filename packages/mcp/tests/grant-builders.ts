/* @layer tests @kind test */
import { PRESETS } from '@bxel/mcp';
import type { BundleId, Grant, Level, ToolRowId } from '@bxel/mcp';

const withBundles = (changes: Partial<Record<BundleId, Level>>, base: Grant = PRESETS.full_control.grant): Grant => ({
  ...base,
  bundles: { ...base.bundles, ...changes },
});

const withTools = (tools: Partial<Record<ToolRowId, Level>>, base: Grant = PRESETS.full_control.grant): Grant => ({ ...base, tools });

export { withBundles, withTools };
