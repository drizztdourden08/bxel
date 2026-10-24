/* @layer renderer-app @kind logic */
import type { ExportSettings, SheetInput, Target } from './export.type';
import { exportSprite } from './export-sprite';
import { sheetSettings } from './sheet-settings';

const sheetInput = (targets: readonly Target[], settings: ExportSettings): SheetInput => ({
  sprites: targets.map(exportSprite),
  settings: sheetSettings(targets, settings),
  trim: settings.trim,
  scale: settings.scale,
  flavour: settings.flavour,
});

export { sheetInput };
