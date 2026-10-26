/* @layer renderer-app @kind logic */
import type { PathArgs } from '../context-menu/menu-args.type';
import { tabPath } from '../workspace/tab-path';

const pathOfArgs = (args: Partial<PathArgs>): string => args.path ?? (args.tabId === undefined ? undefined : tabPath(args.tabId)) ?? '';

export { pathOfArgs };
