/* @layer core @kind test */
import type { Artwork, AssetPaths, CelId, FrameId, Sprite, SpriteId, TagId } from '@bxel/document';
import { splitIntoAssets } from '@bxel/document';
import { brand } from './fixture-to-artwork';
import { legacyArtwork } from './legacy-fixture';

const HERO = brand<SpriteId>('spr_000930');

const shifted = (sprite: Sprite, offset: number): Uint8Array => Uint8Array.from(sprite.cels[Object.keys(sprite.cels)[0] as CelId]?.pixels ?? [], (value) => (value + offset) % 4);

const withFrames = (sprite: Sprite, start: number, count: number, linkLast: boolean): Sprite => {
  const layer = sprite.layers[0];
  if (!layer) return sprite;
  const frames = Array.from({ length: count }, (_, index) => ({ id: brand<FrameId>(`frm_${start + index}`), durationMs: 100 + index }));
  const cels = frames.map((_, index) => brand<CelId>(`cel_${start + index}`));
  const owner = (index: number): CelId => cels[linkLast && index === count - 1 ? index - 1 : index] as CelId;
  return {
    ...sprite,
    frames,
    layers: [{ ...layer, cels: Object.fromEntries(frames.map((frame, index) => [frame.id, owner(index)])) }],
    cels: Object.fromEntries(cels.map((id, index) => [id, { id, pixels: shifted(sprite, index) }])),
  };
};

const animatedArtwork = (): Artwork => {
  const base = legacyArtwork();
  const grassId = base.tilesets[0]?.tiles[0]?.spriteId;
  const sprites = base.sprites.map((sprite) => {
    if (sprite.id === HERO) {
      const hero = withFrames(sprite, 700100, 3, true);
      const [first, second] = hero.frames;
      const tag = { id: brand<TagId>('tag_700199'), name: 'idle', from: first?.id as FrameId, to: second?.id as FrameId, direction: 'pingpong' as const, repeat: 0 };
      return { ...hero, tags: [tag] };
    }
    return sprite.id === grassId ? withFrames(sprite, 700200, 2, false) : sprite;
  });
  return { ...base, sprites };
};

const pathsOf = (artwork: Artwork): AssetPaths =>
  new Map(splitIntoAssets(artwork).files.map((file) => [file.key.id, file.path] as const));

export { animatedArtwork, HERO, pathsOf };
