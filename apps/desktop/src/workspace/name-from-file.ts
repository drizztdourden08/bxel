/* @layer renderer-app @kind logic */
import { fileSafeStem } from '@bxel/document';
import type { AssetContent, AssetSlice } from '@bxel/document';
import { baseName } from '../files/base-name';
import { CONTENT_OF_KIND, NAME_FALLBACK } from './workspace.constants';

const renamed = (content: AssetContent, field: keyof AssetContent, id: string, name: string): AssetContent => {
  const items = content[field] as readonly { readonly id: string; readonly name?: string }[] | undefined;
  return items ? { ...content, [field]: items.map((item) => (item.id === id ? { ...item, name } : item)) } : content;
};

const nameFromFile = (path: string, slice: AssetSlice): AssetSlice | null => {
  const field = CONTENT_OF_KIND[slice.kind];
  const name = baseName(path);
  if (field === undefined || name === '' || fileSafeStem(slice.name, NAME_FALLBACK) === name) return null;
  return { ...slice, name, artwork: renamed(slice.artwork, field, slice.id, name) };
};

export { nameFromFile };
