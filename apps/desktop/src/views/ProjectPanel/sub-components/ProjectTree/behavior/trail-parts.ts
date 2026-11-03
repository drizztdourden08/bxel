/* @layer renderer-app @kind logic */
import type { BrowserItem } from '../../../../../panel-browser/project-browser.type';

const trailParts = (item: BrowserItem): { readonly grant: boolean; readonly unlink: boolean } => {
  const grant = item.readOnly && item.role !== 'group';
  return { grant, unlink: grant && item.role === 'linked' };
};

export { trailParts };
