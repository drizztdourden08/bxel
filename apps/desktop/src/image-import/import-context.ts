/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { DocumentView } from '../documents/document-host.type';
import type { ImportContext } from './image-import.type';

const importContext = (view: DocumentView | null): ImportContext => {
  if (!view) return { documentId: null, bank: null, taken: [], sheetNames: [], tilesetNames: [], tilemapNames: [], spriteCount: 0 };
  const { artwork, documentId } = view.state;
  return {
    documentId,
    bank: findBank(artwork, artwork.defaultBankId) ?? null,
    taken: artwork.sprites.map((sprite) => sprite.name),
    sheetNames: artwork.sheets.map((sheet) => sheet.name),
    tilesetNames: artwork.tilesets.map((tileset) => tileset.name),
    tilemapNames: artwork.tilemaps.map((tilemap) => tilemap.name),
    spriteCount: artwork.sprites.length,
  };
};

export { importContext };
