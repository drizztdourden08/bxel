/* @layer renderer-app @kind logic */
import type { AssetDefaults } from '@bxel/project';
import { DEFAULT_TEXT_OF } from './default-text.constants';

const defaultText = (field: keyof AssetDefaults, defaults: AssetDefaults): string => DEFAULT_TEXT_OF[field](defaults);

export { defaultText };
