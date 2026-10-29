/* @layer renderer-app @kind logic */
import type { BrowserItem } from '../../../panel-browser/project-browser.type';

const exportable = (item: BrowserItem): boolean => item.path !== '' && item.role !== 'ghost' && item.role !== 'group' && item.role !== 'linked';

export { exportable };
