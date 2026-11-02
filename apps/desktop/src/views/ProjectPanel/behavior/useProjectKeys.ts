/* @layer renderer-app @kind hook */
import { openContextMenu } from '@drizztdourden08/brock-react';
import { useZoneKey } from '../../../hooks/useZoneKey';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import {
  PROJECT_COPY_KEY,
  PROJECT_CUT_KEY,
  PROJECT_DUPLICATE_KEY,
  PROJECT_FIND_KEY,
  PROJECT_NEW_FOLDER_KEY,
  PROJECT_NEW_MENU_KEY,
  PROJECT_OPEN_SIDE_KEY,
  PROJECT_PASTE_KEY,
  PROJECT_RENAME_KEY,
  PROJECT_SELECT_ALL_KEY,
  PROJECT_TRASH_KEY,
} from '../../../keymap/zone-key.constants';
import { duplicateItems } from '../../../panel-browser/duplicate-items';
import { NEW_MENU_KEY } from '../../../panel-browser/project-browser.constants';
import { trashItems } from '../../../panel-browser/trash-items';
import { NEW_BUTTON_SELECTOR } from '../ProjectPanel.constants';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { commandTargets } from './command-targets';
import { copyTargets } from './copy-targets';
import { cutTargets } from './cut-targets';
import { pasteTargets } from './paste-targets';
import { openSideTargets } from './open-side-targets';
import { useNewMenuLetters } from './useNewMenuLetters';

const useProjectKeys = (model: ProjectPanelModel): void => {
  const { rowActions, edit, selection } = model;
  const armLetters = useNewMenuLetters(model);
  useZoneKey(PROJECT_RENAME_KEY, (context) => {
    const first = commandTargets(model, context).find((item) => item.role !== 'group' && item.role !== 'ghost');
    if (first) edit.startRename(first.key);
  });
  useZoneKey(PROJECT_TRASH_KEY, (context) => void trashItems(commandTargets(model, context).filter((item) => item.role !== 'group')));
  useZoneKey(PROJECT_DUPLICATE_KEY, (context) => void duplicateItems(commandTargets(model, context), model.refresh));
  useZoneKey(PROJECT_SELECT_ALL_KEY, () => selection.selectAll());
  useZoneKey(PROJECT_NEW_FOLDER_KEY, () => rowActions.newFolder());
  useZoneKey(PROJECT_FIND_KEY, () => rowActions.focusSearch());
  useZoneKey(PROJECT_CUT_KEY, (context) => cutTargets(model, context));
  useZoneKey(PROJECT_COPY_KEY, (context) => copyTargets(model, context));
  useZoneKey(PROJECT_PASTE_KEY, (context) => pasteTargets(model, context));
  useZoneKey(PROJECT_OPEN_SIDE_KEY, (context) => openSideTargets(model, context));
  useZoneKey(PROJECT_NEW_MENU_KEY, () => {
    const box = document.querySelector(NEW_BUTTON_SELECTOR)?.getBoundingClientRect();
    if (!box) return;
    const opened = openContextMenu(COMMAND_ZONE.project, { key: NEW_MENU_KEY }, { point: { x: box.left, y: box.bottom }, trigger: 'keyboard' });
    if (opened) armLetters();
  });
};

export { useProjectKeys };
