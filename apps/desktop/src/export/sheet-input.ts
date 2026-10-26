/* @layer renderer-app @kind logic */
import type { ExportSprite } from '@bxel/formats';
import type { ExportSettings, SheetInput, Target } from './export.type';
import { exportSprite } from './export-sprite';
import { sheetSettings } from './sheet-settings';
import { tiledSheetSettings } from './tiled-sheet-settings';

const sheetInput = (targets: readonly Target[], settings: ExportSettings, extra: readonly ExportSprite[] = []): SheetInput => {
  const effective = tiledSheetSettings(settings);
  const sprites = [...targets.map(exportSprite), ...extra];
  const dims = sprites.map((sprite) => ({ width: sprite.width, height: sprite.height, frames: sprite.frames.length }));
  return {
    sprites,
    settings: sheetSettings(dims, effective),
    trim: effective.trim,
    scale: effective.scale,
    flavour: effective.flavour,
    mergeIdentical: effective.mergeFrames,
  };
};

export { sheetInput };
