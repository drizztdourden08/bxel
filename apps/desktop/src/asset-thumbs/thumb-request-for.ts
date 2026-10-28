/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey } from '@bxel/document';
import { fileKit } from '../files/file-kit';
import type { BrowserItem } from '../project-browser/project-browser.type';
import { LOADED_THUMB_KINDS } from './asset-thumbs.constants';
import type { ThumbRequest } from './asset-thumbs.type';
import { diskThumb } from './disk-thumb';
import { renderThumb } from './render-thumb';
import { thumbSignature } from './thumb-signature';

const loadedRequest = (item: BrowserItem, artwork: Artwork | undefined): ThumbRequest | null => {
  const row = item.row;
  if (row === null || artwork === undefined || row.assetId === null || !LOADED_THUMB_KINDS.includes(row.kind)) return null;
  const key = { kind: row.kind, id: row.assetId } as AssetKey;
  return { key: item.key, signature: thumbSignature(artwork, key), job: () => renderThumb(artwork, key) };
};

const diskRequest = (item: BrowserItem): ThumbRequest | null => {
  const kit = fileKit();
  if (!kit || item.path === '' || item.role !== 'file' || item.kind === 'folder' || item.kind === 'group') return null;
  const { documents } = kit;
  const target = { key: item.key, kind: item.kind, assetId: null, path: item.path, modified: item.modified, size: item.size, loaded: false } as const;
  return { key: item.key, signature: `${item.modified}:${item.size}`, job: () => diskThumb(documents, target) };
};

const thumbRequestFor = (item: BrowserItem, artwork: Artwork | undefined): ThumbRequest | null => {
  if (item.row?.preview !== null && item.row?.preview !== undefined) return null;
  return item.row?.loaded === true ? loadedRequest(item, artwork) : diskRequest(item);
};

export { thumbRequestFor };
