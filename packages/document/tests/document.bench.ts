/* @layer tests @kind bench */
import { ASSET_KIND, flattenFrame, frameToRgba } from '@bxel/document';
import type { AssetSlice, MapLayerId, Tilemap, TilemapId, TilesetId } from '@bxel/document';
import { assetDigest, decodeArtwork, encodeArtwork } from '@bxel/document/native';
import { bench, describe } from 'vitest';
import { benchArtwork } from './bench-artwork';

const HEAVY = { iterations: 5, time: 0, warmupIterations: 2, warmupTime: 0 };
const clock = (): number => Date.UTC(2026, 9, 23, 12, 0, 0);

const layered = benchArtwork([{ index: 1, side: 512, layers: 8, frames: 1 }]);
const layeredSprite = layered.artwork.sprites[0];
const layeredBank = layered.artwork.banks[0];
const firstFrame = layeredSprite?.frames[0]?.id;
if (!layeredSprite || !layeredBank || !firstFrame) throw new Error('the layered fixture is incomplete');

const huge = benchArtwork([{ index: 2, side: 2048, layers: 2, frames: 1 }]);
const hugeSprite = huge.artwork.sprites[0];
const hugeBank = huge.artwork.banks[0];
const hugeFrame = hugeSprite?.frames[0]?.id;
if (!hugeSprite || !hugeBank || !hugeFrame) throw new Error('the large fixture is incomplete');

const library = benchArtwork(Array.from({ length: 200 }, (_, at) => ({ index: at + 1, side: 64, layers: 1, frames: 4 })));
const container = encodeArtwork(library, null, clock);

const MAP_SIDE = 1024;
const MAP_LAYERS = 4;
const tilesetId = 'tls_000001' as TilesetId;
const mapLayers = Array.from({ length: MAP_LAYERS }, (_, row) => ({
  id: `tml_00000${row + 1}` as MapLayerId,
  name: `Layer ${row + 1}`,
  visible: true,
  locked: false,
  cells: Uint32Array.from({ length: MAP_SIDE * MAP_SIDE }, (_cell, at) => (at + row) % 7),
}));
const bigMap: Tilemap = { id: 'tlm_000001' as TilemapId, name: 'Big map', tilesetId, columns: MAP_SIDE, rows: MAP_SIDE, layers: mapLayers };
const mapSlice: AssetSlice = {
  kind: ASSET_KIND.tilemap,
  id: bigMap.id,
  name: bigMap.name,
  artwork: { tilemaps: [bigMap] },
  links: [{ id: tilesetId, path: '../tiles/big.bxtileset' }],
};

describe('document reads, 512 sprite with 8 layers', () => {
  bench('flattenFrame (target 10 ms)', () => {
    flattenFrame(layeredSprite, firstFrame);
  }, HEAVY);
  bench('frameToRgba (target 16 ms)', () => {
    frameToRgba(layeredSprite, layeredBank, firstFrame);
  }, HEAVY);
});

describe('document reads, 2048 sprite with 2 layers', () => {
  bench('flattenFrame (target 20 ms)', () => {
    flattenFrame(hugeSprite, hugeFrame);
  }, HEAVY);
  bench('frameToRgba (target 40 ms)', () => {
    frameToRgba(hugeSprite, hugeBank, hugeFrame);
  }, HEAVY);
});

describe('.bxel container, 200 sprites of 64 by 64 with 4 frames', () => {
  bench('encode (target 400 ms)', () => {
    encodeArtwork(library, null, clock);
  }, HEAVY);
  bench('decode (target 400 ms)', () => {
    decodeArtwork(container);
  }, HEAVY);
});

describe('asset change digest, 1024 by 1024 map with 4 layers', () => {
  bench('digest of an unchanged tilemap (target 5 ms)', () => {
    assetDigest(mapSlice);
  }, HEAVY);
});
