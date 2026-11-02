/* @layer renderer-app @kind logic */
import { NEW_MENU_KEY } from '../../../panel-browser/project-browser.constants';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { menuKeyOf } from './menu-key-of';
import type { MenuWhere } from './menu-selection.type';

const menuSelection = (model: ProjectPanelModel, where: MenuWhere): readonly string[] => {
  const key = menuKeyOf(where);
  if (key === undefined || key === NEW_MENU_KEY || model.browser.itemOf(key) === undefined) return [];
  return model.selection.keys.has(key) ? [...model.selection.keys] : [key];
};

export { menuSelection };
