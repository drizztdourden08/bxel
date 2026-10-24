/* @layer renderer-app @kind logic */
import { CANVAS_DEFAULTS, RANGES } from './canvas-look.constants';
import type { CanvasSettings } from './canvas-look.type';
import { clampSetting } from './clamp-setting';

const checkerSize = (settings: Pick<CanvasSettings, 'checkerPreset' | 'checkerSize'>): number => {
  const custom = Math.round(clampSetting(settings.checkerSize, RANGES.checkerSize, CANVAS_DEFAULTS.checkerSize));
  const preset = Number(settings.checkerPreset);
  return Number.isInteger(preset) && preset >= RANGES.checkerSize.min ? Math.min(preset, RANGES.checkerSize.max) : custom;
};

export { checkerSize };
