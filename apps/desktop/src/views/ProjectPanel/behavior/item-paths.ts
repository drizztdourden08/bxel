/* @layer renderer-app @kind logic */
import type { BrowserItem } from '../../../panel-browser/project-browser.type';
import { exportable } from './exportable';

const itemPaths = (items: readonly BrowserItem[]): string[] => items.filter(exportable).map((item) => item.path);

export { itemPaths };
