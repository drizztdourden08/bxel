/* @layer renderer-app @kind logic */
import { entryKindOf, isNativeAsset } from '@bxel/project';
import type { RowKind } from '../asset-list/asset-list.type';
import type { ItemKind } from './project-browser.type';

const kindOfName = (name: string): ItemKind => {
  const kind = entryKindOf(name);
  if (kind === 'project' || kind === 'legacy' || kind === 'image') return kind;
  return isNativeAsset(name) ? (kind as RowKind) : 'other';
};

export { kindOfName };
