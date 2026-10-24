/* @layer renderer-app @kind constants */
import { renderConfigControl } from './config-source/render-config-control';
import { DEFAULT_SETTINGS } from './settings.constants';

const SETTINGS = { defaults: DEFAULT_SETTINGS, renderControl: renderConfigControl };

export { SETTINGS };
