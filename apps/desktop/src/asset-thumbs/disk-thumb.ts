/* @layer renderer-app @kind logic */
import type { AssetKind } from '@bxel/document';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { toDataUrl } from '../export/to-data-url';
import { GIF_MIME, IMAGE_BYTES_MAX, NATIVE_KINDS, THUMB_MIME } from './asset-thumbs.constants';
import type { ThumbTarget } from './asset-thumbs.type';
import { decodedThumb } from './decoded-thumb';
import { embeddedPreview } from './embedded-preview';

const imageUrl = (bytes: Uint8Array, path: string): string | null =>
  bytes.length > IMAGE_BYTES_MAX ? null : toDataUrl(bytes, path.toLowerCase().endsWith('.gif') ? GIF_MIME : THUMB_MIME);

const nativeUrl = (bytes: Uint8Array, kind: string): string | null =>
  embeddedPreview(bytes, kind as AssetKind | 'legacy') ?? decodedThumb(bytes, kind);

const diskThumb = async (documents: DocumentsPort, target: ThumbTarget): Promise<string | null> => {
  if (target.kind === 'other' || target.kind === 'project') return null;
  const bytes = await documents.read(target.path).catch(() => null);
  if (bytes === null) return null;
  if (target.kind === 'image') return imageUrl(bytes, target.path);
  try {
    return NATIVE_KINDS.includes(target.kind) ? nativeUrl(bytes, target.kind) : null;
  } catch {
    return null;
  }
};

export { diskThumb };
