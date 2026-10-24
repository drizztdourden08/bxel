/* @layer renderer-app @kind constants */
import { resolveLinkPath } from '@bxel/document';
import type { AssetKind } from '@bxel/document';
import { decodePalette, decodeSheet, decodeSprite, decodeTilemap, decodeTileset } from '@bxel/document/native';
import { isSamePath } from '@bxel/project';
import { linkedSlice } from './linked-slice';
import type { AssetFile, Decoder, DecodedFile } from './workspace.type';

const withLink =
  (decode: (bytes: Uint8Array, linked: DecodedFile['slice'] | null) => ReturnType<Decoder>['report'], kind: AssetKind): Decoder =>
  (file, pool) => {
    const linked = linkedSlice(file, pool, kind);
    return { report: decode(file.bytes, linked.found?.slice ?? null), relinked: linked.relinked };
  };

const sheetRelinked = (file: AssetFile, members: readonly DecodedFile[]): boolean =>
  file.manifest.links.some((link) => {
    const path = resolveLinkPath(file.path, link.path);
    return !members.some((each) => isSamePath(each.path, path)) && members.some((each) => each.slice.id === link.id);
  });

const decodeSheetFile: Decoder = (file, pool) => {
  const members = pool.filter((each) => each.slice.kind === 'sprite' || each.slice.kind === 'tileset');
  return { report: decodeSheet(file.bytes, members.map((each) => each.slice)), relinked: sheetRelinked(file, members) };
};

const ASSET_DECODERS: Readonly<Partial<Record<AssetKind, Decoder>>> = {
  palette: (file) => ({ report: decodePalette(file.bytes), relinked: false }),
  sprite: withLink(decodeSprite, 'palette'),
  tileset: withLink(decodeTileset, 'palette'),
  sheet: decodeSheetFile,
  tilemap: withLink(decodeTilemap, 'tileset'),
};

export { ASSET_DECODERS };
