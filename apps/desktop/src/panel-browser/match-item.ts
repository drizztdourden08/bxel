/* @layer renderer-app @kind logic */
import type { RowKind } from '../asset-list/asset-list.type';
import { EMPTY_STATUS } from './project-browser.constants';
import { stateHolds } from './state-holds';
import type { BrowserItem, BrowserQuery, MatchContext } from './project-browser.type';

const textMatches = (item: BrowserItem, text: string): boolean => {
  const needle = text.trim().toLowerCase();
  return needle === '' || item.name.toLowerCase().includes(needle) || item.fileName.toLowerCase().includes(needle);
};

const insideMatches = (item: BrowserItem, inside: string | null): boolean =>
  inside === null || `/${item.path.toLowerCase()}/`.includes(`/${inside}/`);

const usersMatch = (item: BrowserItem, users: ReadonlySet<string> | null): boolean =>
  users === null || (item.row?.assetId !== null && item.row?.assetId !== undefined && users.has(item.row.assetId));

const matchItem = (item: BrowserItem, query: BrowserQuery, context: MatchContext): boolean => {
  const kindOk = query.kinds.length === 0 || query.kinds.includes(item.kind as RowKind);
  const status = context.statuses.get(item.key) ?? EMPTY_STATUS;
  return kindOk && stateHolds(status, query.states) && usersMatch(item, context.users) && insideMatches(item, query.inside) && textMatches(item, query.text);
};

export { matchItem };
