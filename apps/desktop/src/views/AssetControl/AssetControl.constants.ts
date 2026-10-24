/* @layer renderer-app @kind constants */
import type { SnapChange } from '../../platform-preset/snap-plan.type';

const ASSET_CONTROL_TEXT = {
  setLabel: 'Swatch set',
  setPlaceholder: 'Choose a set',
  addColors: 'Add colours',
  replaceColors: 'Replace colours',
  bankLabel: 'Palette',
  change: 'Change...',
} as const;

const ASSET_CONTROL_FIELDS: readonly string[] = ['sprite.bank', 'palette.cap', 'palette.set', 'sprite.platform', 'sprite.platformReport'];

const NO_CHANGES: readonly SnapChange[] = [];

export { ASSET_CONTROL_FIELDS, ASSET_CONTROL_TEXT, NO_CHANGES };
