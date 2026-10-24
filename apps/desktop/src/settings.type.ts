/* @layer renderer-app @kind types */
import type { SwatchSet } from '@bxel/project';
import type { BaseSettings } from '@drizztdourden08/brock-core';
import type { AssistantSettings } from './assistant/assistant.type';
import type { CanvasSettings } from './canvas-look/canvas-look.type';
import type { ExportSettings, SavedPreset } from './export/export.type';
import type { CreationMemory } from './new-sprite/new-sprite.type';

interface AppSettings extends BaseSettings, CanvasSettings, AssistantSettings {
  newSprite: CreationMemory;
  exportLast?: ExportSettings;
  exportPresets?: readonly SavedPreset[];
  swatchSets?: readonly SwatchSet[];
}

export type { AppSettings };
