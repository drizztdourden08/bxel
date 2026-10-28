/* @layer renderer-app @kind logic */
import type { Artwork, Sprite } from '@bxel/document';
import { effectivePlatform } from '../platform-preset/effective-platform';
import { presetById } from '../platform-preset/preset-by-id';
import { PANEL_TEXT } from './palette-panel.constants';
import type { PaletteLock } from './palette-panel.type';

const paletteLock = (artwork: Artwork, sprite: Sprite): PaletteLock => {
  const platform = effectivePlatform(artwork, sprite);
  const preset = platform.strict ? presetById(platform.platformId) : null;
  if (!preset || preset.colour.kind !== 'fixedSet') return { locked: false, reason: '' };
  return { locked: true, reason: PANEL_TEXT.locked(preset.name) };
};

export { paletteLock };
