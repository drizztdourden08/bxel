/* @layer renderer-app @kind logic */
import type { AssetRow } from '../asset-list/asset-list.type';
import { EMPTY_STATUS, USED_BY_KINDS } from './project-browser.constants';
import type { BrowserItem, ItemStatus, StatusContext } from './project-browser.type';
import { tabKeyOf } from './tab-key-of';

const missingNames = (item: BrowserItem, row: AssetRow, context: StatusContext): readonly string[] => {
  const own = item.role === 'ghost' ? [item.name] : [];
  return row.assetId === null ? own : [...own, ...(context.missing.get(row.assetId) ?? [])];
};

const baseStatus = (item: BrowserItem, context: StatusContext): ItemStatus => {
  const { row } = item;
  if (row === null) return EMPTY_STATUS;
  const tab = tabKeyOf(row);
  const users = row.assetId === null ? 0 : (context.referrers.get(row.assetId)?.length ?? 0);
  return {
    ...EMPTY_STATUS,
    unsaved: row.dirty,
    open: tab !== null && context.openKeys.has(tab),
    active: tab !== null && context.activeKey === tab,
    missing: missingNames(item, row, context),
    usedBy: users,
    unused: row.loaded && USED_BY_KINDS.includes(row.kind) && users === 0,
  };
};

export { baseStatus };
