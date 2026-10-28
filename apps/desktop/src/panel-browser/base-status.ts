/* @layer renderer-app @kind logic */
import type { AssetKey } from '@bxel/document';
import { keyId } from '../workspace/key-id';
import { EMPTY_STATUS, USED_BY_KINDS } from './project-browser.constants';
import type { BrowserItem, ItemStatus, StatusContext } from './project-browser.type';

const baseStatus = (item: BrowserItem, context: StatusContext): ItemStatus => {
  const { row } = item;
  if (row === null) return EMPTY_STATUS;
  const id = row.assetId;
  const tab = id === null || row.kind === 'image' || row.kind === 'other' ? null : keyId({ kind: row.kind, id } as AssetKey);
  const users = id === null ? 0 : (context.referrers.get(id)?.length ?? 0);
  const own = item.role === 'ghost' ? [item.name] : [];
  return {
    ...EMPTY_STATUS,
    unsaved: row.dirty,
    open: tab !== null && context.openKeys.has(tab),
    active: tab !== null && context.activeKey === tab,
    missing: [...own, ...(id === null ? [] : (context.missing.get(id) ?? []))],
    usedBy: users,
    unused: row.loaded && USED_BY_KINDS.includes(row.kind) && users === 0,
  };
};

export { baseStatus };
