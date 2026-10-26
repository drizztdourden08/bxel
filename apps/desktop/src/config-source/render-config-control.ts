/* @layer renderer-app @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { PRESET_FACTS_KEY } from '../platform-preset/platform-preset.constants';
import { APP_CONTROL_FIELDS } from '../views/AppControl/AppControl.constants';
import { AppControl } from '../views/AppControl';
import { ASSET_CONTROL_FIELDS } from '../views/AssetControl/AssetControl.constants';
import { AssetControl } from '../views/AssetControl';
import { PROJECT_CONTROL_FIELDS } from '../views/ProjectControl/ProjectControl.constants';
import { PresetFactsControl } from '../views/PresetBrowser/sub-components/PresetFactsControl';
import { ProjectControl } from '../views/ProjectControl';

const renderConfigControl = (key: string): ReactNode | null => {
  if (key === PRESET_FACTS_KEY) return createElement(PresetFactsControl);
  if (ASSET_CONTROL_FIELDS.includes(key)) return createElement(AssetControl, { field: key });
  if (PROJECT_CONTROL_FIELDS.includes(key)) return createElement(ProjectControl, { field: key });
  return APP_CONTROL_FIELDS.includes(key) ? createElement(AppControl, { field: key }) : null;
};

export { renderConfigControl };
