/* @layer core @kind test */
import type { AssetKind, AssetSlice, SliceSource } from '@bxel/document';
import {
  decodePalette,
  decodeSheet,
  decodeSprite,
  decodeTilemap,
  decodeTileset,
  encodePalette,
  encodeSheet,
  encodeSprite,
  encodeTilemap,
  encodeTileset,
  readAssetManifest,
} from '@bxel/document/native';
import type { AssetReport } from '@bxel/document/native';
import { assetClock } from './asset-fixture';

type Encoder = (slice: AssetSlice, preview: Uint8Array | null, clock: () => number) => Uint8Array;
type StoredFile = { readonly path: string; readonly bytes: Uint8Array };
type Decoded = { readonly sources: readonly SliceSource[]; readonly reports: readonly AssetReport[] };

const ENCODERS: Partial<Record<AssetKind, Encoder>> = {
  palette: encodePalette,
  sprite: encodeSprite,
  sheet: encodeSheet,
  tileset: encodeTileset,
  tilemap: encodeTilemap,
};

const encodeSlice = (slice: AssetSlice): Uint8Array => {
  const encode = ENCODERS[slice.kind];
  if (!encode) throw new Error(`No encoder for ${slice.kind}.`);
  return encode(slice, null, assetClock);
};

const kindOf = (file: StoredFile): AssetKind | undefined => readAssetManifest(file.bytes)?.kind;

const sliceOf = (report: AssetReport): AssetSlice => {
  if (!report.slice) throw new Error(`The file did not load: ${report.issues[0]?.message ?? ''}`);
  return report.slice;
};

const linkedSlice = (bytes: Uint8Array, pool: readonly AssetSlice[]): AssetSlice | null => {
  const links = readAssetManifest(bytes)?.links ?? [];
  return pool.find((slice) => links.some((link) => link.id === slice.id)) ?? null;
};

const decodeFiles = (files: readonly StoredFile[]): Decoded => {
  const of = (kind: AssetKind): StoredFile[] => files.filter((file) => kindOf(file) === kind);
  const reports = new Map<string, AssetReport>();
  const run = (file: StoredFile, report: AssetReport): AssetSlice => {
    reports.set(file.path, report);
    return sliceOf(report);
  };
  const palettes = of('palette').map((file) => run(file, decodePalette(file.bytes)));
  const sprites = of('sprite').map((file) => run(file, decodeSprite(file.bytes, linkedSlice(file.bytes, palettes))));
  const tilesets = of('tileset').map((file) => run(file, decodeTileset(file.bytes, linkedSlice(file.bytes, palettes))));
  const sheets = of('sheet').map((file) => run(file, decodeSheet(file.bytes, [...sprites, ...tilesets])));
  const maps = of('tilemap').map((file) => run(file, decodeTilemap(file.bytes, linkedSlice(file.bytes, tilesets))));
  const pathOf = (slice: AssetSlice): string => files.find((file) => readAssetManifest(file.bytes)?.assetId === slice.id)?.path ?? '';
  const sources = [...palettes, ...sprites, ...tilesets, ...sheets, ...maps].map((slice) => ({ path: pathOf(slice), slice }));
  return { sources, reports: [...reports.values()] };
};

export { decodeFiles, encodeSlice };

