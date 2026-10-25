/* @layer renderer-app @kind constants */
import { resolveLinkPath } from '@bxel/document';
import type { AssetKind } from '@bxel/document';
import { decodePalette, decodeSheet, decodeSprite, decodeTilemap, decodeTileset } from '@bxel/document/native';
import { linkedSlice } from './linked-slice';
import { poolById } from './pool-by-id';
import { poolByPath } from './pool-by-path';
import type { AssetFile, Decoder, DecodedFile, DecodedPool } from './workspace.type';

const withLink =
  (decode: (bytes: Uint8Array, linked: DecodedFile['slice'] | null) => ReturnType<Decoder>['report'], kind: AssetKind): Decoder =>
  (file, pool) => {
    const linked = linkedSlice(file, pool, kind);
    return { report: decode(file.bytes, linked.found?.slice ?? null), relinked: linked.relinked };
  };

const MEMBER_KINDS: readonly AssetKind[] = ['sprite', 'tileset'];

const sheetRelinked = (file: AssetFile, pool: DecodedPool): boolean =>
  file.manifest.links.some((link) => {
    const path = resolveLinkPath(file.path, link.path);
    return (
      !MEMBER_KINDS.some((kind) => poolByPath(pool, kind, path) !== undefined) &&
      MEMBER_KINDS.some((kind) => poolById(pool, kind, link.id) !== undefined)
    );
  });

const decodeSheetFile: Decoder = (file, pool) => {
  const members = pool.all.filter((each) => each.slice.kind === 'sprite' || each.slice.kind === 'tileset');
  return { report: decodeSheet(file.bytes, members.map((each) => each.slice)), relinked: sheetRelinked(file, pool) };
};

const ASSET_DECODERS: Readonly<Partial<Record<AssetKind, Decoder>>> = {
  palette: (file) => ({ report: decodePalette(file.bytes), relinked: false }),
  sprite: withLink(decodeSprite, 'palette'),
  tileset: withLink(decodeTileset, 'palette'),
  sheet: decodeSheetFile,
  tilemap: withLink(decodeTilemap, 'tileset'),
};

export { ASSET_DECODERS };
