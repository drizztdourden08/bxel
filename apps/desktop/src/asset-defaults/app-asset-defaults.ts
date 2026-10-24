/* @layer renderer-app @kind logic */
import type { AssetDefaults } from '@bxel/project';
import { APP_ASSET_DEFAULTS, DEFAULT_RANGES } from './asset-defaults.constants';

const within = (value: unknown, range: { readonly min: number; readonly max: number }, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? Math.min(range.max, Math.max(range.min, Math.round(value))) : fallback;

const appAssetDefaults = (stored: Partial<AssetDefaults> | undefined): AssetDefaults => ({
  ...APP_ASSET_DEFAULTS,
  ...stored,
  size: {
    width: within(stored?.size?.width, DEFAULT_RANGES.size, APP_ASSET_DEFAULTS.size.width),
    height: within(stored?.size?.height, DEFAULT_RANGES.size, APP_ASSET_DEFAULTS.size.height),
  },
  colorLimit: within(stored?.colorLimit, DEFAULT_RANGES.colorLimit, APP_ASSET_DEFAULTS.colorLimit),
  frameDurationMs: within(stored?.frameDurationMs, DEFAULT_RANGES.frameDurationMs, APP_ASSET_DEFAULTS.frameDurationMs),
  palette: stored?.palette?.kind === 'preset' ? stored.palette : APP_ASSET_DEFAULTS.palette,
});

export { appAssetDefaults };
