/* @layer renderer-app @kind constants */
import { renderConfigControl } from './config-source/render-config-control';
import { DEFAULT_SETTINGS } from './settings.constants';

const SETTINGS = { defaults: DEFAULT_SETTINGS, renderControl: renderConfigControl };

const TITLE_BAR_MENU = { label: 'Quick actions', icon: 'zap' } as const;

export { SETTINGS, TITLE_BAR_MENU };
