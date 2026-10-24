/* @layer renderer-app @kind types */
import type { BaseSettings } from '@drizztdourden08/brock-core';
import type { ExportSettings, SavedPreset } from './export/export.type';

interface AppSettings extends BaseSettings {
  exportLast?: ExportSettings;
  exportPresets?: readonly SavedPreset[];
}

export type { AppSettings };
