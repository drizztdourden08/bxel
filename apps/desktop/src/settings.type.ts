/* @layer renderer-app @kind types */
import type { BaseSettings } from '@drizztdourden08/brock-core';
import type { CanvasSettings } from './canvas-look/canvas-look.type';
import type { ExportSettings, SavedPreset } from './export/export.type';
import type { CreationMemory } from './new-sprite/new-sprite.type';

interface AppSettings extends BaseSettings, CanvasSettings {
  newSprite: CreationMemory;
  exportLast?: ExportSettings;
  exportPresets?: readonly SavedPreset[];
}

export type { AppSettings };
