/* @layer core @kind logic */
import { strToU8, zipSync } from 'fflate';
import type { DocumentState } from '../model/artwork.type';
import { buildZippable } from './build-zippable';
import type { Clock } from './clock.type';
import { collectBlobs } from './collect-blobs';
import { ZIP_MTIME } from './container.constants';
import { toDocumentJson } from './to-document-json';

const encodeArtwork = (state: DocumentState, preview: Uint8Array | null, clock: Clock): Uint8Array => {
  const { artwork } = state;
  const documentBytes = strToU8(JSON.stringify(toDocumentJson(artwork), null, 2));
  const blobs = collectBlobs(artwork);
  const files = buildZippable({ artwork, savedAt: clock(), documentBytes, preview, blobs });
  return zipSync(files, { mtime: ZIP_MTIME });
};

export { encodeArtwork };
