/* @layer renderer-app @kind logic */
import { animationSequence, composeAnimationFrame, findBank, paletteRgba, tileAnimationIssue } from '@bxel/document';
import type { Animation, Artwork, Tile, Tileset } from '@bxel/document';
import type { TileAnimationEntry } from '@bxel/formats';
import { FRAME_KEY_DECODER, RGBA_BYTES, TILE_ANIMATION_TEXT } from './tile-animation-frames.constants';
import type { FrameBuilder, FrameWorld, TileFrames } from './tile-animation-frames.type';

const rgbaOf = (indices: Uint8Array, table: Uint8Array): Uint8ClampedArray => {
  const out = new Uint8ClampedArray(indices.length * RGBA_BYTES);
  indices.forEach((index, at) => out.set(table.subarray(index * RGBA_BYTES, (index + 1) * RGBA_BYTES), at * RGBA_BYTES));
  return out;
};

const frameKey = (builder: FrameBuilder, tileset: Tileset, table: Uint8Array, indices: Uint8Array): number => {
  const content = FRAME_KEY_DECODER.decode(indices);
  const known = builder.keys.get(content);
  if (known !== undefined) return known;
  const key = builder.next;
  builder.next += 1;
  builder.keys.set(content, key);
  builder.tiles.push({ key, image: { data: rgbaOf(indices, table), width: tileset.tileWidth, height: tileset.tileHeight } });
  return key;
};

const entryOf = (world: FrameWorld, tile: Tile, animation: Animation): TileAnimationEntry | null => {
  const { artwork, tileset, builder } = world;
  const link = tile.animation;
  const bank = findBank(artwork, tileset.bankId);
  if (!link || !bank) return null;
  const { steps } = animationSequence(animation, link.tagId);
  if (steps.length === 0) return null;
  const table = paletteRgba(bank);
  const frames = steps.map((step) => ({
    key: frameKey(builder, tileset, table, composeAnimationFrame(artwork, animation, step.frameId, step.flip)),
    durationMs: step.durationMs,
  }));
  return { key: tile.key, start: link.start, frames };
};

const tileAnimationFrames = (artwork: Artwork, tileset: Tileset): TileFrames => {
  const builder: FrameBuilder = {
    tiles: [],
    keys: new Map(),
    next: Math.max(tileset.nextKey, ...tileset.tiles.map((tile) => tile.key + 1)),
  };
  const animations: TileAnimationEntry[] = [];
  const skipped: string[] = [];
  for (const tile of tileset.tiles) {
    if (!tile.animation) continue;
    const issue = tileAnimationIssue(artwork, tileset, tile);
    const animation = artwork.animations.find((each) => each.id === tile.animation?.animationId);
    const entry = issue === null && animation ? entryOf({ artwork, tileset, builder }, tile, animation) : null;
    if (entry) animations.push(entry);
    else skipped.push(TILE_ANIMATION_TEXT.skipped(tile.key, issue ?? 'it has no frames to play.'));
  }
  return { tiles: builder.tiles, animations, skipped };
};

export { tileAnimationFrames };
