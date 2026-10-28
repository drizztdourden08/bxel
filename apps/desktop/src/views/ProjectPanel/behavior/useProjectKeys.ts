/* @layer renderer-app @kind hook */
import { openContextMenu } from '@drizztdourden08/brock-react';
import { useZoneKey } from '../../../hooks/useZoneKey';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import {
  PROJECT_DUPLICATE_KEY,
  PROJECT_FIND_KEY,
  PROJECT_NEW_FOLDER_KEY,
  PROJECT_NEW_MENU_KEY,
  PROJECT_RENAME_KEY,
  PROJECT_SELECT_ALL_KEY,
  PROJECT_TRASH_KEY,
} from '../../../keymap/zone-key.constants';
import { duplicateItems } from '../../../project-browser/duplicate-items';
import { NEW_MENU_KEY } from '../../../project-browser/project-browser.constants';
import { trashItems } from '../../../project-browser/trash-items';
import { NEW_BUTTON_SELECTOR } from '../ProjectPanel.constants';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { commandTargets } from './command-targets';

const useProjectKeys = (model: ProjectPanelModel): void => {
  const { rowActions, edit, selection } = model;
  useZoneKey(PROJECT_RENAME_KEY, (context) => {
    const first = commandTargets(model, context).find((item) => item.role !== 'group' && item.role !== 'ghost');
    if (first) edit.startRename(first.key);
  });
  useZoneKey(PROJECT_TRASH_KEY, (context) => void trashItems(commandTargets(model, context).filter((item) => item.role !== 'group')));
  useZoneKey(PROJECT_DUPLICATE_KEY, (context) => duplicateItems(commandTargets(model, context)));
  useZoneKey(PROJECT_SELECT_ALL_KEY, () => selection.selectAll());
  useZoneKey(PROJECT_NEW_FOLDER_KEY, () => rowActions.newFolder());
  useZoneKey(PROJECT_FIND_KEY, () => rowActions.focusSearch());
  useZoneKey(PROJECT_NEW_MENU_KEY, () => {
    const box = document.querySelector(NEW_BUTTON_SELECTOR)?.getBoundingClientRect();
    if (box) openContextMenu(COMMAND_ZONE.project, { key: NEW_MENU_KEY }, { point: { x: box.left, y: box.bottom }, trigger: 'keyboard' });
  });
};

export { useProjectKeys };
