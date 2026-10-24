/* @layer core @kind logic */
import type { AcceptedSource } from './accepted-source.type';
import { borrowedContent } from './borrowed-content';
import type { ContentKey } from './content-key.type';
import type { ContentItem } from './gather-content.type';
import { mergeById } from './merge-by-id';
import type { Merged } from './merged.type';
import { ownedContent } from './owned-content';

const gatherContent = <K extends ContentKey>(accepted: readonly AcceptedSource[], key: K): Merged<ContentItem<K>> => {
  const owned = accepted.flatMap((item) => (ownedContent(item.slice)[key] ?? []) as readonly ContentItem<K>[]);
  const borrowed = accepted.flatMap((item) => (borrowedContent(item.slice)[key] ?? []) as readonly ContentItem<K>[]);
  return mergeById(owned, borrowed);
};

export { gatherContent };
