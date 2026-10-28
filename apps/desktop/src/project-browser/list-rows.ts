/* @layer renderer-app @kind logic */
import { KIND_ORDER } from '../asset-list/asset-list.constants';
import { groupItem } from './group-item';
import { listKindOf } from './list-kind-of';
import { GROUP_PREFIX, PLURAL_LABEL } from './project-browser.constants';
import { sortItems } from './sort-items';
import type { BrowserItem, ListBucket as Bucket, ListInput, VisibleRow } from './project-browser.type';

const bucketKey = (item: BrowserItem, group: ListInput['view']['group']): string => {
  if (group === 'kind') return `${GROUP_PREFIX}kind:${listKindOf(item)}`;
  return group === 'folder' ? `${GROUP_PREFIX}folder:${item.parentKey ?? ''}` : '';
};

const bucketName = (key: string, input: ListInput, item: BrowserItem): string => {
  if (input.view.group === 'kind') return PLURAL_LABEL[listKindOf(item)];
  return input.tree.items.get(item.parentKey ?? '')?.name ?? key;
};

const bucketsOf = (files: readonly BrowserItem[], input: ListInput): readonly Bucket[] => {
  const found = new Map<string, Bucket>();
  for (const item of files) {
    const key = bucketKey(item, input.view.group);
    const bucket = found.get(key) ?? { header: groupItem(key, bucketName(key, input, item)), items: [] };
    bucket.items.push(item);
    found.set(key, bucket);
  }
  const buckets = [...found.values()];
  return input.view.group === 'kind' ? buckets.sort((left, right) => rank(left) - rank(right)) : buckets;
};

const rank = (bucket: Bucket): number => KIND_ORDER.indexOf(listKindOf(bucket.items[0] as BrowserItem));

const listRows = (input: ListInput): readonly VisibleRow[] => {
  const files = [...input.tree.items.values()].filter((item) => (item.role === 'file' || item.role === 'ghost') && (input.matches === null || input.matches.has(item.key)));
  const sorted = sortItems(files, input.view.sort);
  if (input.view.group === 'none') return sorted.map((item, index) => ({ item, depth: 0, posinset: index + 1, setsize: sorted.length, expanded: null }));
  const rows: VisibleRow[] = [];
  const buckets = bucketsOf(sorted, input);
  buckets.forEach((bucket, at) => {
    const open = !input.collapsed.has(bucket.header.key);
    rows.push({ item: bucket.header, depth: 0, posinset: at + 1, setsize: buckets.length, expanded: open, count: bucket.items.length });
    if (open) bucket.items.forEach((item, index) => rows.push({ item, depth: 1, posinset: index + 1, setsize: bucket.items.length, expanded: null }));
  });
  return rows;
};

export { listRows };
