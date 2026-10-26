/* @layer renderer-app @kind constants */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { copyPath } from '../asset-list/copy-path';
import { pathOfArgs } from '../asset-list/path-of-args';
import { revealRow } from '../asset-list/reveal-row';
import { commandArgs } from '../context-menu/command-args';
import type { PathArgs, TabArgs } from '../context-menu/menu-args.type';
import { closeTab } from '../workspace/close-tab';
import { closeTabsBeside } from '../workspace/close-tabs-beside';
import { moveTabBy } from '../workspace/move-tab-by';
import { FILE_TEXT } from '../files/files.constants';

const group = FILE_TEXT.group;

const withTab = (run: (tabId: string) => unknown) => (context?: CommandContext): void => {
  const { tabId } = commandArgs<TabArgs>(context);
  if (tabId !== undefined) void run(tabId);
};

const TAB_MENU_COMMANDS: readonly CommandDef[] = [
  { id: 'tab.close', label: 'Close tab', group, run: withTab(closeTab) },
  { id: 'tab.close_others', label: 'Close the other tabs', group, run: withTab((tabId) => closeTabsBeside(tabId, 'others')) },
  { id: 'tab.close_right', label: 'Close the tabs to the right', group, run: withTab((tabId) => closeTabsBeside(tabId, 'right')) },
  { id: 'tab.move_left', label: 'Move tab left', group, run: withTab((tabId) => moveTabBy(tabId, -1)) },
  { id: 'tab.move_right', label: 'Move tab right', group, run: withTab((tabId) => moveTabBy(tabId, 1)) },
  { id: 'asset.reveal', label: 'Show the file in its folder', group, run: (context?: CommandContext) => revealRow({ path: pathOfArgs(commandArgs<PathArgs>(context)) }) },
  { id: 'asset.copy_path', label: 'Copy the path of the file', group, run: (context?: CommandContext) => void copyPath(pathOfArgs(commandArgs<PathArgs>(context))) },
];

export { TAB_MENU_COMMANDS };
