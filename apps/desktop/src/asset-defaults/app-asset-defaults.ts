/* @layer renderer-app @kind logic */
import type { AssetDefaults } from '@bxel/project';
import { APP_ASSET_DEFAULTS, DEFAULT_RANGES } from './asset-defaults.constants';

const within = (value: unknown, range: { readonly min: number; readonly max: number }, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? Math.min(range.max, Math.max(range.min, Math.round(value))) : fallback;

const sizeWithin = (stored: { width?: unknown; height?: unknown } | undefined, fallback: { width: number; height: number }) => ({
  width: within(stored?.width, DEFAULT_RANGES.size, fallback.width),
  height: within(stored?.height, DEFAULT_RANGES.size, fallback.height),
});

const appAssetDefaults = (stored: Partial<AssetDefaults> | undefined): AssetDefaults => ({
  ...APP_ASSET_DEFAULTS,
  ...stored,
  size: sizeWithin(stored?.size, APP_ASSET_DEFAULTS.size),
  pixelGrid: sizeWithin(stored?.pixelGrid, APP_ASSET_DEFAULTS.pixelGrid),
  colorLimit: within(stored?.colorLimit, DEFAULT_RANGES.colorLimit, APP_ASSET_DEFAULTS.colorLimit),
  frameDurationMs: within(stored?.frameDurationMs, DEFAULT_RANGES.frameDurationMs, APP_ASSET_DEFAULTS.frameDurationMs),
  palette: stored?.palette?.kind === 'preset' ? stored.palette : APP_ASSET_DEFAULTS.palette,
});

export { appAssetDefaults };
