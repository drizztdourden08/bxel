/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import type { StatusArgs } from '../../../context-menu/menu-args.type';
import { menuData } from '../../../context-menu/menu-data';
import { unless } from '../../../context-menu/unless';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import { useViewStore } from '../../../stores/useViewStore';
import { ASSET_SETTINGS_COMMAND } from '../../../config-entry/config-entry.constants';
import { FILE_COMMAND } from '../../../files/files.constants';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { useWorkspaceStore } from '../../../stores/useWorkspaceStore';
import { keyId } from '../../../workspace/key-id';
import { tabPath } from '../../../workspace/tab-path';
import { STATUS_MENU, ZOOM_PERCENTS } from '../EditorStatus.constants';
import { COMMON } from './status-menu-entries.constants';

const zoomEntries = (): readonly ContextMenuEntry[] => {
  const current = Math.round(useReadoutStore.getState().zoom * 100);
  return [
    {
      label: STATUS_MENU.zoomTo,
      items: ZOOM_PERCENTS.map((percent) => ({
        command: 'view.zoom_to',
        label: `${percent}%`,
        args: { percent },
        kind: 'radio' as const,
        checked: percent === current,
      })),
    },
    COMMAND_ID.zoomFit,
    COMMAND_ID.zoomActual,
  ];
};

const rulerEntry = (): ContextMenuEntry => ({ command: COMMAND_ID.rulers, checked: useViewStore.getState().rulers });

const fileEntries = (): readonly ContextMenuEntry[] => {
  const { tabs, activeTab, workspaces } = useWorkspaceStore.getState();
  const tab = tabs.find((each) => each.id === activeTab);
  const dirty = tab ? (workspaces[tab.documentId]?.dirty.has(keyId(tab.key)) ?? false) : false;
  const args = { tabId: tab?.id };
  const hasPath = tab !== undefined && tabPath(tab.id) !== undefined;
  return [
    { command: FILE_COMMAND.save, ...unless(dirty, STATUS_MENU.saved) },
    ASSET_SETTINGS_COMMAND,
    { command: 'asset.reveal', label: STATUS_MENU.reveal, args, hidden: !hasPath },
    { command: 'asset.copy_path', label: STATUS_MENU.copyPath, args, hidden: !hasPath },
  ];
};

const colourEntries = (position: number): readonly ContextMenuEntry[] => [
  { command: 'palette.edit_swatch', label: STATUS_MENU.edit, args: { slot: position } },
  COMMAND_ID.swapColours,
];

const itemEntries = (item: string | undefined): readonly ContextMenuEntry[] => {
  if (item === 'cursor') return [{ command: 'status.copy_cursor', ...unless(useReadoutStore.getState().pointer !== null, STATUS_MENU.outside) }, rulerEntry()];
  if (item === 'zoom') return [...zoomEntries(), rulerEntry()];
  if (item === 'colour-1') return colourEntries(1);
  if (item === 'colour-2') return colourEntries(2);
  if (item === 'saved') return fileEntries();
  return [];
};

const statusMenuEntries = (context: ContextMenuContext): readonly ContextMenuEntry[] => {
  const own = itemEntries(menuData<StatusArgs>(context).item);
  return [...own, ...(own.length > 0 ? ['separator' as const] : []), ...COMMON];
};

export { statusMenuEntries };
