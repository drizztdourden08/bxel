/* @layer core @kind types */
import type { ToolName } from '../tools/tool.type';
import type { BUNDLES } from './bundle.constants';
import type { LEVELS } from './level.constants';
import type { PRESET_IDS } from './preset.constants';
import type { SETTING_ROWS } from './setting-rows.constants';

type Level = (typeof LEVELS)[number];

type BundleId = (typeof BUNDLES)[number]['id'];

type BundleDef = {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly document: boolean;
};

type ToolKind = 'read' | 'write' | 'mixed';

type ToolEntry = {
  readonly bundle: BundleId;
  readonly kind: ToolKind;
  readonly writes?: (input: unknown) => boolean;
  readonly routed?: 'steps' | 'command';
  readonly special?: 'mayRestart';
};

type SettingRowId = (typeof SETTING_ROWS)[keyof typeof SETTING_ROWS];

type ToolRowId = Exclude<ToolName, 'set_setting'> | SettingRowId;

type PresetId = (typeof PRESET_IDS)[number];

export type { BundleDef, BundleId, Level, PresetId, SettingRowId, ToolEntry, ToolKind, ToolRowId };
