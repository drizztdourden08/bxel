/* @layer renderer-app @kind constants */
import type { PresetOrigin } from '../../export/preset-entry.type';
import { PRESET_TEXT } from '../../export/preset-list.constants';
import type { SnapChange } from '../../platform-preset/snap-plan.type';

const ASSET_CONTROL_TEXT = {
  setLabel: 'Swatch set',
  setPlaceholder: 'Choose a set',
  addColors: 'Add colours',
  replaceColors: 'Replace colours',
  bankLabel: 'Palette',
  change: 'Change...',
  presetRun: 'Run',
  presetRename: 'Rename',
  presetDelete: 'Delete',
  presetSave: 'Save',
  presetCancel: 'Cancel',
  presetName: 'Preset name',
} as const;

const ASSET_CONTROL_FIELDS: readonly string[] = ['sprite.bank', 'palette.cap', 'palette.set', 'sprite.platform', 'sprite.platformReport', 'sprite.exportPresets', 'sheet.exportPresets'];

const PRESET_ORIGINS: readonly PresetOrigin[] = ['asset', 'project', 'app'];

const PRESET_HEADING: Readonly<Record<PresetOrigin, string | null>> = { asset: null, project: PRESET_TEXT.groupProject, app: PRESET_TEXT.groupApp };

const NO_CHANGES: readonly SnapChange[] = [];

export { ASSET_CONTROL_FIELDS, ASSET_CONTROL_TEXT, NO_CHANGES, PRESET_HEADING, PRESET_ORIGINS };
