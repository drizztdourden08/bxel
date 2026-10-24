/* @layer core @kind barrel */
export { checkAreas } from './checks/check-areas';
export { checkSprite } from './checks/check-sprite';
export type * from './defaults/defaults.type';
export { presetDefaults } from './defaults/preset-defaults';
export type * from './model/area.type';
export type * from './model/preset.type';
export type * from './model/sprite-size.type';
export { findPreset } from './presets/find-preset';
export { listPresets } from './presets/list-presets';
export { AREA_CLASH_CODE, PRESET_ERROR_CODE } from './results/preset-error.constants';
export type * from './results/preset-result.type';
export { snapColor } from './snap/snap-color';
export { snapPalette } from './snap/snap-palette';
export type * from './snap/snap.type';
