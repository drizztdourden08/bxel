/* @layer core @kind test */
import type { Artwork, AssetKey, ChangeSet, PresetId, SpriteChange } from '@bxel/document';
import { assetsTouched, emptyChanges, relativeLinkPath, resolveLinkPath } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { brand } from './fixture-to-artwork';
import { legacyArtwork } from './legacy-fixture';
import { applySteps, buildWorld, patch, spriteStep, tilesetOf } from './tile-engine';

const touch = (id: string): SpriteChange => ({
  id: brand<SpriteChange['id']>(id),
  kind: 'updated',
  meta: false,
  structure: false,
  recolored: false,
  cels: [],
});

const keysOf = (keys: readonly AssetKey[]): string[] => keys.map((key) => `${key.kind}:${key.id}`);

const presetId = (artwork: Artwork, name: string): PresetId => {
  const found = artwork.presets.find((preset) => preset.name === name);
  if (!found) throw new Error(`No preset ${name}.`);
  return found.id;
};

const spriteId = (artwork: Artwork, name: string): string => {
  const found = artwork.sprites.find((sprite) => sprite.name === name);
  if (!found) throw new Error(`No sprite ${name}.`);
  return found.id;
};

const firstOf = <T extends { readonly id: string }>(items: readonly T[]): T => {
  const [first] = items;
  if (!first) throw new Error('The fixture has one.');
  return first;
};

const everything = (artwork: Artwork): ChangeSet => {
  const tileset = firstOf(artwork.tilesets);
  return {
    artwork: true,
    banks: [{ id: firstOf(artwork.banks).id, kind: 'updated' }],
    sprites: [touch('spr_000010'), touch(firstOf(tileset.tiles).spriteId)],
    sheets: [{ id: firstOf(artwork.sheets).id, kind: 'updated' }],
    presets: ['Hearts at 4x', 'Tree alone', 'Characters sheet'].map((name) => ({ id: presetId(artwork, name), kind: 'updated' })),
    tilesets: [{ id: tileset.id, kind: 'updated' }],
    tilemaps: [{ id: firstOf(artwork.tilemaps).id, kind: 'updated' }],
  };
};

describe('assetsTouched', () => {
  it('maps every ChangeSet field to the assets whose files change', () => {
    const artwork = legacyArtwork();
    const keys = keysOf(assetsTouched(everything(artwork), artwork, artwork));
    expect(keys).toEqual([
      `project:${artwork.id}`,
      `palette:${artwork.banks[0]?.id}`,
      'sprite:spr_000010',
      `tileset:${artwork.tilesets[0]?.id}`,
      `sheet:${artwork.sheets[0]?.id}`,
      `sprite:${spriteId(artwork, 'Tree')}`,
      `sheet:${artwork.sheets[1]?.id}`,
      `tilemap:${artwork.tilemaps[0]?.id}`,
    ]);
  });

  it('answers with nothing for an empty change set', () => {
    const artwork = legacyArtwork();
    expect(assetsTouched(emptyChanges(), artwork, artwork)).toEqual([]);
  });

  it('finds the file of a removed preset in the artwork before the change', () => {
    const before = legacyArtwork();
    const removed = presetId(before, 'Tree alone');
    const after = { ...before, presets: before.presets.filter((preset) => preset.id !== removed) };
    const changes = { ...emptyChanges(), presets: [{ id: removed, kind: 'removed' as const }] };
    expect(keysOf(assetsTouched(changes, before, after))).toEqual([`sprite:${spriteId(before, 'Tree')}`]);
  });

  it('reports the tileset, not the sprite, when a tile is painted, and the sprite when art is', () => {
    const world = buildWorld();
    const before = world.engine.state().artwork;
    const tile = tilesetOf(world.engine).tiles[0]?.spriteId ?? '';
    const result = applySteps(world.engine, [spriteStep('pixels.patch', patch(2, [3, 3, 3, 3]), tile)]);
    const after = world.engine.state().artwork;
    expect(keysOf(assetsTouched(result.changes, before, after))).toEqual([`tileset:${tilesetOf(world.engine).id}`]);
    const heart = applySteps(world.engine, [spriteStep('pixels.patch', patch(2, [3, 3, 3, 3]), 'spr_000010')]);
    expect(keysOf(assetsTouched(heart.changes, after, world.engine.state().artwork))).toEqual(['sprite:spr_000010']);
  });
});

describe('link paths', () => {
  it('builds paths relative to the file and resolves them back', () => {
    expect(relativeLinkPath('sprites/a.bxsprite', 'palettes/p.bxpalette')).toBe('../palettes/p.bxpalette');
    expect(relativeLinkPath('sprites/a.bxsprite', 'sprites/b.bxsprite')).toBe('b.bxsprite');
    expect(relativeLinkPath('a.bxsprite', 'palettes/p.bxpalette')).toBe('palettes/p.bxpalette');
    expect(relativeLinkPath('x/y/a.bxsprite', 'x/p.bxpalette')).toBe('../p.bxpalette');
    expect(resolveLinkPath('sprites/a.bxsprite', '../palettes/p.bxpalette')).toBe('palettes/p.bxpalette');
    expect(resolveLinkPath('a.bxsprite', './palettes/p.bxpalette')).toBe('palettes/p.bxpalette');
    expect(resolveLinkPath('x/y/a.bxsprite', relativeLinkPath('x/y/a.bxsprite', 'x/p.bxpalette'))).toBe('x/p.bxpalette');
  });
});
