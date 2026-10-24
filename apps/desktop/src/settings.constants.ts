/* @layer renderer-app @kind constants */
import { DEFAULT_BASE_SETTINGS } from '@drizztdourden08/brock-core';
import { ASSISTANT_DEFAULTS } from './assistant/assistant.constants';
import { CANVAS_DEFAULTS } from './canvas-look/canvas-look.constants';
import { NEW_MEMORY_DEFAULT } from './new-sprite/new-sprite.constants';
import type { AppSettings } from './settings.type';

const DEFAULT_SETTINGS: AppSettings = {
  ...DEFAULT_BASE_SETTINGS,
  ...CANVAS_DEFAULTS,
  ...ASSISTANT_DEFAULTS,
  newSprite: NEW_MEMORY_DEFAULT,
};

export { DEFAULT_SETTINGS };
