/* @layer renderer-app @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { APP_CONTROL_FIELDS } from '../views/AppControl/AppControl.constants';
import { AppControl } from '../views/AppControl';
import { ASSET_CONTROL_FIELDS } from '../views/AssetControl/AssetControl.constants';
import { AssetControl } from '../views/AssetControl';
import { ConfigRow } from '../views/ConfigRow';
import { PROJECT_CONTROL_FIELDS } from '../views/ProjectControl/ProjectControl.constants';
import { ProjectControl } from '../views/ProjectControl';

const controlOf = (key: string): ReactNode | null => {
  if (ASSET_CONTROL_FIELDS.includes(key)) return createElement(AssetControl, { field: key });
  if (PROJECT_CONTROL_FIELDS.includes(key)) return createElement(ProjectControl, { field: key });
  return APP_CONTROL_FIELDS.includes(key) ? createElement(AppControl, { field: key }) : null;
};

const renderConfigControl = (key: string): ReactNode | null => {
  const control = controlOf(key);
  return control === null ? null : createElement(ConfigRow, { field: key, children: control });
};

export { renderConfigControl };
