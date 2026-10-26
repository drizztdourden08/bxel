/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { ASSET_SETTINGS_COMMAND } from '../../../config-entry/config-entry.constants';
import { FILE_COMMAND } from '../../../files/files.constants';
import { useWorkspaceStore } from '../../../stores/useWorkspaceStore';
import { keyId } from '../../../workspace/key-id';
import { tabPath } from '../../../workspace/tab-path';
import { TAB_MENU } from '../AssetTabs.constants';
import { STRIP_ENTRIES } from './tab-menu-entries.constants';
import { tabIdOf } from './tab-id-of';

const tabMenuEntries = (context: ContextMenuContext): readonly ContextMenuEntry[] => {
  const { tabs, workspaces } = useWorkspaceStore.getState();
  const at = tabs.findIndex((each) => each.id === tabIdOf(context));
  const tab = tabs[at];
  if (!tab) return STRIP_ENTRIES;
  const args = { tabId: tab.id };
  const workspace = workspaces[tab.documentId];
  const hasPath = tabPath(tab.id) !== undefined;
  return [
    { command: FILE_COMMAND.save, ...unless(workspace?.dirty.has(keyId(tab.key)) ?? false, TAB_MENU.saved) },
    FILE_COMMAND.saveAs,
    ASSET_SETTINGS_COMMAND,
    { command: FILE_COMMAND.saveAll, ...unless(Object.values(workspaces).some((each) => each.dirty.size > 0), TAB_MENU.allSaved) },
    'separator',
    { command: 'asset.reveal', label: TAB_MENU.reveal, args, hidden: !hasPath },
    { command: 'asset.copy_path', label: TAB_MENU.copyPath, args, hidden: !hasPath },
    FILE_COMMAND.export,
    {
      label: TAB_MENU.move,
      items: [
        { command: 'tab.move_left', args, ...unless(at > 0, TAB_MENU.first) },
        { command: 'tab.move_right', args, ...unless(at < tabs.length - 1, TAB_MENU.last) },
      ],
    },
    'separator',
    { command: 'tab.close', label: TAB_MENU.close, args },
    { command: 'tab.close_others', label: TAB_MENU.closeOthers, args, ...unless(tabs.length > 1, TAB_MENU.onlyTab) },
    { command: 'tab.close_right', label: TAB_MENU.closeRight, args, ...unless(at < tabs.length - 1, TAB_MENU.last) },
  ];
};

export { tabMenuEntries };
