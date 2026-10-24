/* @layer renderer-app @kind constants */
import { DEFAULT_BASE_SETTINGS } from '@drizztdourden08/brock-core';
import { ASSISTANT_DEFAULTS } from './assistant/assistant.constants';
import { CANVAS_DEFAULTS } from './canvas-look/canvas-look.constants';
import { APP_ASSET_DEFAULTS } from './asset-defaults/asset-defaults.constants';
import { PROJECT_DEFAULTS } from './project/project.constants';
import type { AppSettings } from './settings.type';

const DEFAULT_SETTINGS: AppSettings = {
  ...DEFAULT_BASE_SETTINGS,
  ...CANVAS_DEFAULTS,
  ...ASSISTANT_DEFAULTS,
  ...PROJECT_DEFAULTS,
  assetDefaults: APP_ASSET_DEFAULTS,
};

export { DEFAULT_SETTINGS };
