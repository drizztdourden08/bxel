/* @layer core @kind logic */
import { KIND_OF_ENTRY_EXTENSION } from './entry-kind.constants';
import type { EntryKind } from './entry-kind.type';

const entryKindOf = (name: string): EntryKind => {
  const dot = name.lastIndexOf('.');
  const extension = dot < 1 ? '' : name.slice(dot + 1).toLowerCase();
  return Object.hasOwn(KIND_OF_ENTRY_EXTENSION, extension) ? (KIND_OF_ENTRY_EXTENSION[extension] ?? 'other') : 'other';
};

export { entryKindOf };
