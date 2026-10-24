/* @layer core @kind test */
import type { Artwork, AssetKind, SplitFile } from '@bxel/document';
import { counterIdSource, mergeSlices, splitIntoAssets } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { decodeFiles, encodeSlice } from './asset-bytes';
import { legacyArtwork } from './legacy-fixture';

const byId = <T extends { readonly id: string }>(items: readonly T[]): T[] =>
  [...items].sort((left, right) => (left.id < right.id ? -1 : 1));

const normal = (artwork: Artwork): Artwork => ({
  ...artwork,
  banks: byId(artwork.banks),
  sprites: byId(artwork.sprites),
  sheets: byId(artwork.sheets),
  presets: byId(artwork.presets),
  tilesets: byId(artwork.tilesets),
  tilemaps: byId(artwork.tilemaps),
});

const ofKind = (files: readonly SplitFile[], kind: AssetKind): SplitFile[] => files.filter((file) => file.key.kind === kind);

const fileOf = (files: readonly SplitFile[], name: string): SplitFile => {
  const found = files.find((file) => file.name === name);
  if (!found) throw new Error(`No file for ${name}.`);
  return found;
};

describe('splitIntoAssets', () => {
  it('writes one file per palette, sprite, sheet, tileset and tilemap', () => {
    const artwork = legacyArtwork();
    expect(artwork.sprites.filter((sprite) => sprite.role === 'sprite')).toHaveLength(6);
    const { files } = splitIntoAssets(artwork);
    expect(ofKind(files, 'palette')).toHaveLength(3);
    expect(ofKind(files, 'sprite')).toHaveLength(6);
    expect(ofKind(files, 'sheet')).toHaveLength(2);
    expect(ofKind(files, 'tileset')).toHaveLength(1);
    expect(ofKind(files, 'tilemap')).toHaveLength(1);
    const carried = ofKind(files, 'sprite').flatMap((file) => file.slice.artwork.sprites ?? []);
    expect(carried.every((sprite) => sprite.role === 'sprite')).toBe(true);
  });

  it('names files after the assets, fixes illegal characters and numbers the conflicts', () => {
    const { files, conflicts } = splitIntoAssets(legacyArtwork());
    expect(fileOf(files, 'Hero').path).toBe('sprites/Hero.bxsprite');
    expect(fileOf(files, 'hero')).toMatchObject({ path: 'sprites/hero 2.bxsprite', suffix: 2, renamed: false });
    expect(fileOf(files, 'a/b:c')).toMatchObject({ path: 'sprites/a_b_c.bxsprite', renamed: true, suffix: 0 });
    expect(fileOf(files, 'Tree').folder).toBe('sprites');
    expect(ofKind(files, 'tilemap')[0]?.path).toMatch(/^tilemaps\/.*\.bxmap$/);
    expect(ofKind(files, 'tileset')[0]?.path).toMatch(/^tilemaps\/.*\.bxtiles$/);
    expect(conflicts).toEqual([{ folder: 'sprites', fileName: 'Hero.bxsprite', names: ['Hero', 'hero'] }]);
  });

  it('moves export presets to the file they export and keeps mixed ones with the project', () => {
    const plan = splitIntoAssets(legacyArtwork());
    expect(plan.project.presets.map((preset) => preset.name)).toEqual(['Hearts at 4x']);
    expect(fileOf(plan.files, 'Tree').slice.artwork.presets?.map((preset) => preset.name)).toEqual(['Tree alone']);
    expect(fileOf(plan.files, 'Characters').slice.artwork.presets?.map((preset) => preset.name)).toEqual(['Characters sheet']);
    expect(plan.project).toMatchObject({ name: 'Heart pair', coverSpriteId: 'spr_000010', platformId: 'game-boy' });
  });

  it('links every file to what it uses with paths relative to itself', () => {
    const { files } = splitIntoAssets(legacyArtwork());
    const tree = fileOf(files, 'Tree');
    expect(tree.slice.links).toEqual([{ id: tree.slice.artwork.sprites?.[0]?.bankId, path: '../palettes/Cool.bxpalette' }]);
    const sheet = fileOf(files, 'Characters');
    expect(sheet.slice.links.map((link) => link.path)).toEqual(['../sprites/Hero.bxsprite', '../sprites/hero 2.bxsprite', '../sprites/Tree.bxsprite']);
    const hearts = fileOf(files, 'hearts');
    expect(hearts.slice.links).toHaveLength(2);
    const map = ofKind(files, 'tilemap')[0];
    const set = ofKind(files, 'tileset')[0];
    expect(map?.slice.links).toEqual([{ id: set?.key.id, path: `${set?.fileName}` }]);
  });
});

describe('merging the split files back', () => {
  it('rebuilds an equal artwork from the slices', () => {
    const artwork = legacyArtwork();
    const plan = splitIntoAssets(artwork);
    const sources = plan.files.map((file) => ({ path: file.path, slice: file.slice }));
    const merged = mergeSlices(sources, counterIdSource(5000), plan.project);
    expect(merged.issues).toEqual([]);
    expect(merged.rekeyed).toEqual([]);
    expect(normal(merged.artwork)).toEqual(normal(artwork));
  });

  it('rebuilds an equal artwork when the files go through bytes, and rewrites the same bytes', () => {
    const artwork = legacyArtwork();
    const plan = splitIntoAssets(artwork);
    const stored = plan.files.map((file) => ({ path: file.path, bytes: encodeSlice(file.slice) }));
    const { sources, reports } = decodeFiles(stored);
    expect(reports.every((report) => report.outcome === 'ok')).toBe(true);
    const merged = mergeSlices(sources, counterIdSource(5000), plan.project);
    expect(merged.issues).toEqual([]);
    expect(normal(merged.artwork)).toEqual(normal(artwork));
    for (const [index, file] of plan.files.entries()) {
      const source = sources.find((item) => item.path === file.path);
      expect(source && encodeSlice(source.slice)).toEqual(stored[index]?.bytes);
    }
  });

  it('shares one bank between the sprites and the palette file', () => {
    const plan = splitIntoAssets(legacyArtwork());
    const sources = plan.files.map((file) => ({ path: file.path, slice: file.slice }));
    const merged = mergeSlices(sources, counterIdSource(5000), plan.project);
    expect(merged.artwork.banks).toHaveLength(3);
    expect(new Set(merged.artwork.banks.map((bank) => bank.id)).size).toBe(3);
  });
});
