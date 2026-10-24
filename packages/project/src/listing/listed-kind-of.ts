/* @layer core @kind logic */
import { KIND_OF_EXTENSION } from './listing.constants';
import type { ListedKind } from './listing.type';

const listedKindOf = (name: string): ListedKind => {
  const dot = name.lastIndexOf('.');
  return dot < 1 ? 'other' : (KIND_OF_EXTENSION[name.slice(dot + 1).toLowerCase()] ?? 'other');
};

export { listedKindOf };
