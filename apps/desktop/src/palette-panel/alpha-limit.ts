/* @layer renderer-app @kind logic */
import type { Artwork, Sprite } from '@bxel/document';
import { effectivePlatform } from '../platform-preset/effective-platform';
import { presetById } from '../platform-preset/preset-by-id';
import { GENERIC_FAMILY } from './alpha-limit.constants';
import { PANEL_TEXT } from './palette-panel.constants';
import type { AlphaLimit } from './palette-panel.type';

const alphaLimit = (artwork: Artwork, sprite: Sprite | null): AlphaLimit => {
  const platform = effectivePlatform(artwork, sprite ?? undefined);
  const preset = platform.strict ? presetById(platform.platformId) : null;
  if (!preset || preset.family === GENERIC_FAMILY) return { binary: false, reason: '' };
  return { binary: true, reason: PANEL_TEXT.binaryAlpha(preset.name) };
};

export { alphaLimit };
