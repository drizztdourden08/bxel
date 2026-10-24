/* @layer renderer-app @kind constants */
import { DEFAULT_BASE_SETTINGS } from '@drizztdourden08/brock-core';
import { NEW_MEMORY_DEFAULT } from './new-sprite/new-sprite.constants';
import type { AppSettings } from './settings.type';

const DEFAULT_SETTINGS: AppSettings = { ...DEFAULT_BASE_SETTINGS, newSprite: NEW_MEMORY_DEFAULT };

export { DEFAULT_SETTINGS };
