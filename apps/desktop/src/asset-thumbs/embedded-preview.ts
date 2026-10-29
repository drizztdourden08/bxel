/* @layer renderer-app @kind logic */
import type { AssetKind } from '@bxel/document';
import { decodeArtwork, openAssetContainer } from '@bxel/document/native';
import { toDataUrl } from '../export/to-data-url';
import { THUMB_MIME } from './asset-thumbs.constants';

const embeddedPreview = (bytes: Uint8Array, kind: AssetKind | 'legacy'): string | null => {
  if (kind === 'legacy') {
    const preview = decodeArtwork(bytes).preview;
    return preview === null ? null : toDataUrl(preview, THUMB_MIME);
  }
  const opened = openAssetContainer(bytes, kind);
  if (!opened.ok || opened.value.manifest.preview === null) return null;
  const image = opened.value.archive.files.get(opened.value.manifest.preview);
  return image === undefined ? null : toDataUrl(image, THUMB_MIME);
};

export { embeddedPreview };
