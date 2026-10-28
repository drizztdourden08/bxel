/* @layer renderer-app @kind constants */
import type { PresetOrigin } from '../../export/preset-entry.type';
import { PRESET_TEXT } from '../../export/preset-list.constants';
import type { SnapChange } from '../../platform-preset/snap-plan.type';
import type { PairSpec } from './AssetControl.type';

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

const PAIR_FIELDS: Readonly<Record<string, PairSpec>> = {
  'sprite.size': { parts: [{ key: 'sprite.width', label: 'Width' }, { key: 'sprite.height', label: 'Height' }], joiner: 'by', unit: 'px', min: 1, max: 2048, step: 1 },
  'sprite.pivot': { parts: [{ key: 'sprite.pivotX', label: 'Pivot x' }, { key: 'sprite.pivotY', label: 'Pivot y' }], joiner: 'and', unit: 'px', min: 0, step: 0.5 },
  'sprite.pixelGrid': { parts: [{ key: 'sprite.gridWidth', label: 'Grid cell across' }, { key: 'sprite.gridHeight', label: 'Grid cell down' }], joiner: 'by', unit: 'px', min: 1, max: 2048, step: 1 },
  'tilemap.size': { parts: [{ key: 'tilemap.columns', label: 'Columns' }, { key: 'tilemap.rows', label: 'Rows' }], joiner: 'by', unit: 'tiles', min: 1, max: 1024, step: 1 },
};

const ASSET_CONTROL_FIELDS: readonly string[] = [...Object.keys(PAIR_FIELDS), 'sprite.bank', 'palette.cap', 'sprite.platform', 'sprite.platformReport', 'sprite.exportPresets', 'sheet.exportPresets'];

const PRESET_ORIGINS: readonly PresetOrigin[] = ['asset', 'project', 'app'];

const PRESET_HEADING: Readonly<Record<PresetOrigin, string | null>> = { asset: null, project: PRESET_TEXT.groupProject, app: PRESET_TEXT.groupApp };

const NO_CHANGES: readonly SnapChange[] = [];

export { ASSET_CONTROL_FIELDS, ASSET_CONTROL_TEXT, NO_CHANGES, PAIR_FIELDS, PRESET_HEADING, PRESET_ORIGINS };
