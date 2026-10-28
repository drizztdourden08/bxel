/* @layer renderer-app @kind types */
import type { AssetDefaults, SwatchSet } from '@bxel/project';
import type { BaseSettings } from '@drizztdourden08/brock-core';
import type { AssistantSettings } from './assistant/assistant.type';
import type { ManagerViews } from './manager-views/manager-views.type';
import type { PalettePanelSettings } from './palette-view/palette-view.type';
import type { CanvasSettings } from './canvas-look/canvas-look.type';
import type { ExportSettings, SavedPreset } from './export/export.type';
import type { ToolStoredSettings } from './editor/tool-options/tool-stored-settings.type';
import type { ProjectSettings } from './project/project.type';
import type { LayerThumbSize } from './stores/layer-view-store.type';

interface AppSettings extends BaseSettings, CanvasSettings, AssistantSettings, ProjectSettings, ToolStoredSettings {
  assetDefaults: AssetDefaults;
  exportLast?: ExportSettings;
  exportPresets?: readonly SavedPreset[];
  exportPresetsOfferedIn?: readonly string[];
  swatchSets?: readonly SwatchSet[];
  managerViews?: ManagerViews;
  layerThumbSize?: LayerThumbSize;
  palettePanel?: PalettePanelSettings;
}

export type { AppSettings };
