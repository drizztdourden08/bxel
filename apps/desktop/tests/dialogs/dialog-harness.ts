/* @layer renderer-app @kind test */
import { counterIdSource } from '@bxel/document';
import type { DocumentId, Sprite } from '@bxel/document';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { createDocumentHost } from '../../src/documents/create-document-host';
import type { DocumentHost } from '../../src/documents/document-host.type';
import type { SourceImage } from '../../src/image-import/image-import.type';

type Paint = (x: number, y: number) => readonly [number, number, number, number];

const newHost = (): DocumentHost => createDocumentHost({ ids: counterIdSource() });

const hostWithFile = (): { host: DocumentHost; documentId: DocumentId } => {
  const host = newHost();
  return { host, documentId: createDefaultArtwork(host) };
};

const sourceImage = (width: number, height: number, paint: Paint, fileName = 'caps.png'): SourceImage => {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) data.set(paint(x, y), (y * width + x) * 4);
  }
  return { fileName, width, height, data };
};

const sprites = (host: DocumentHost, documentId: DocumentId): readonly Sprite[] => host.view(documentId)?.state.artwork.sprites ?? [];

const revisionOf = (host: DocumentHost, documentId: DocumentId): number => host.view(documentId)?.state.revision ?? 0;

export { hostWithFile, newHost, revisionOf, sourceImage, sprites };
