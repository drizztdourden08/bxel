/* @layer core @kind test */
import type { AssetSlice, SliceSource, SplitPlan } from '@bxel/document';
import { counterIdSource, MERGE_ISSUE, mergeSlices, splitIntoAssets } from '@bxel/document';
import { decodeSheet } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';
import { encodeSlice } from './asset-bytes';
import { legacyArtwork } from './legacy-fixture';

const plan = (): SplitPlan => splitIntoAssets(legacyArtwork());

const sourcesOf = (split: SplitPlan): SliceSource[] => split.files.map((file) => ({ path: file.path, slice: file.slice }));

const sliceAt = (split: SplitPlan, name: string): AssetSlice => {
  const found = split.files.find((file) => file.name === name);
  if (!found) throw new Error(`No ${name}.`);
  return found.slice;
};

const COPY_PATH = 'sprites/Tree - Copy.bxsprite';

describe('mergeSlices: copied files', () => {
  it('re-keys a file copied in Explorer, reports it, and keeps the original ids', () => {
    const split = plan();
    const tree = sliceAt(split, 'Tree');
    const sources = [{ path: COPY_PATH, slice: tree }, ...sourcesOf(split)];
    const merged = mergeSlices(sources, counterIdSource(7000), split.project);
    expect(merged.rekeyed).toHaveLength(1);
    const [record] = merged.rekeyed;
    expect(record).toMatchObject({ path: COPY_PATH, kind: 'sprite', oldId: tree.id });
    expect(record?.newId).not.toBe(tree.id);
    expect(record?.count).toBeGreaterThan(4);
    expect(merged.issues.map((issue) => issue.code)).toEqual([MERGE_ISSUE.DUPLICATE_ID]);
    expect(merged.issues[0]?.path).toBe(COPY_PATH);
    const trees = merged.artwork.sprites.filter((sprite) => sprite.name === 'Tree');
    expect(trees.map((sprite) => sprite.id).sort()).toEqual([tree.id, record?.newId].sort());
    const celIds = merged.artwork.sprites.flatMap((sprite) => Object.keys(sprite.cels));
    expect(new Set(celIds).size).toBe(celIds.length);
    const layerIds = merged.artwork.sprites.flatMap((sprite) => sprite.layers).map((layer) => layer.id);
    expect(new Set(layerIds).size).toBe(layerIds.length);
  });

  it('remaps what the copy refers to inside itself, such as its export preset', () => {
    const split = plan();
    const tree = sliceAt(split, 'Tree');
    const sources = [...sourcesOf(split), { path: COPY_PATH, slice: tree }];
    const merged = mergeSlices(sources, counterIdSource(7000), split.project);
    const copy = merged.artwork.sprites.find((sprite) => sprite.id === merged.rekeyed[0]?.newId);
    const presets = merged.artwork.presets.filter((preset) => preset.name === 'Tree alone');
    expect(presets).toHaveLength(2);
    expect(presets.map((preset) => preset.scope.sprites[0]).sort()).toEqual([tree.id, copy?.id].sort());
    expect(new Set(merged.artwork.presets.map((preset) => preset.id)).size).toBe(merged.artwork.presets.length);
  });

  it('follows a link by its path before its id, so a sheet of the copy keeps pointing at the copy', () => {
    const split = plan();
    const tree = sliceAt(split, 'Tree');
    const sheet = sliceAt(split, 'Characters');
    const repointed = {
      ...sheet,
      links: sheet.links.map((link) => (link.id === tree.id ? { id: link.id, path: '../sprites/Tree - Copy.bxsprite' } : link)),
    };
    const others = sourcesOf(split).filter((source) => source.slice.id !== sheet.id);
    const sources = [...others, { path: COPY_PATH, slice: tree }, { path: 'sheets/Characters.bxsheet', slice: repointed }];
    const merged = mergeSlices(sources, counterIdSource(7000), split.project);
    const newId = merged.rekeyed[0]?.newId;
    const placed = merged.artwork.sheets.find((item) => item.id === sheet.id)?.entries.map((entry) => entry.spriteId);
    expect(placed?.[2]).toBe(newId);
    expect(placed?.[0]).not.toBe(newId);
  });

  it('keeps one file when the same path is listed twice', () => {
    const split = plan();
    const sources = sourcesOf(split);
    const first = sources[0];
    const merged = mergeSlices(first ? [...sources, first] : sources, counterIdSource(7000), split.project);
    expect(merged.issues.map((issue) => issue.code)).toEqual([MERGE_ISSUE.DUPLICATE_PATH]);
    expect(merged.artwork.banks).toHaveLength(3);
  });
});

describe('mergeSlices: links and banks', () => {
  it('drops a placeholder sprite when the real sprite file is there, keeps it when it is not', () => {
    const split = plan();
    const sheet = sliceAt(split, 'Characters');
    const hero = sliceAt(split, 'Hero');
    const loaded = decodeSheet(encodeSlice(sheet), [hero]).slice;
    if (!loaded) throw new Error('The sheet did not load.');
    expect(loaded.artwork.sprites).toHaveLength(2);
    const palettes = sourcesOf(split).filter((source) => source.slice.kind === 'palette');
    const present = mergeSlices([...palettes, { path: 'sprites/Hero.bxsprite', slice: hero }, { path: 'sheets/c.bxsheet', slice: loaded }], counterIdSource(7000));
    expect(present.artwork.sprites.map((sprite) => sprite.name).sort()).toEqual(['Hero', 'hero 2', 'Tree'].sort());
    expect(present.artwork.sprites.find((sprite) => sprite.name === 'Hero')?.layers[0]?.locked).toBe(false);
    const absent = mergeSlices([{ path: 'sheets/c.bxsheet', slice: loaded }], counterIdSource(7000));
    expect(absent.artwork.sprites).toHaveLength(2);
    expect(absent.artwork.banks).toHaveLength(1);
  });

  it('keeps the first copy of a palette and says so when copies differ and no palette file exists', () => {
    const split = plan();
    const hero = sliceAt(split, 'Hero');
    const lower = sliceAt(split, 'hero');
    const [bank] = lower.artwork.banks ?? [];
    const changed = bank ? { ...lower, artwork: { ...lower.artwork, banks: [{ ...bank, name: 'Changed' }] } } : lower;
    const merged = mergeSlices([{ path: 'a.bxsprite', slice: hero }, { path: 'b.bxsprite', slice: changed }], counterIdSource(7000));
    expect(merged.artwork.banks).toHaveLength(1);
    expect(merged.artwork.banks[0]?.name).toBe(bank ? 'Warm' : '');
    expect(merged.issues.map((issue) => issue.code)).toEqual([MERGE_ISSUE.BANK_COPY_DIFFERS]);
  });

  it('prefers the palette file over the stale copy inside a sprite', () => {
    const split = plan();
    const hero = sliceAt(split, 'Hero');
    const palette = sliceAt(split, 'Warm');
    const [bank] = palette.artwork.banks ?? [];
    const edited = bank ? { ...palette, name: 'Warmer', artwork: { banks: [{ ...bank, name: 'Warmer' }] } } : palette;
    const merged = mergeSlices([{ path: 'a.bxsprite', slice: hero }, { path: 'p.bxpalette', slice: edited }], counterIdSource(7000));
    expect(merged.artwork.banks.map((item) => item.name)).toEqual(['Warmer']);
    expect(merged.issues).toEqual([]);
  });

  it('falls back to the first palette and no cover when the project names ones that are gone', () => {
    const split = plan();
    const meta = { ...split.project, defaultBankId: split.project.defaultBankId.replace('2', '9') as typeof split.project.defaultBankId };
    const merged = mergeSlices(sourcesOf(split).slice(0, 4), counterIdSource(7000), { ...meta, coverSpriteId: null });
    expect(merged.issues.map((issue) => issue.code)).toEqual([MERGE_ISSUE.DEFAULT_BANK_MISSING]);
    expect(merged.artwork.defaultBankId).toBe(merged.artwork.banks[0]?.id);
    const noCover = mergeSlices(sourcesOf(split).slice(0, 3), counterIdSource(7000), { ...split.project, defaultBankId: merged.artwork.defaultBankId });
    expect(noCover.issues.map((issue) => issue.code)).toContain(MERGE_ISSUE.COVER_MISSING);
    expect(noCover.artwork.coverSpriteId).toBeNull();
  });

  it('makes an artwork of its own when no project is given', () => {
    const split = plan();
    const merged = mergeSlices(sourcesOf(split), counterIdSource(7000));
    expect(merged.artwork.id).toMatch(/^art_/);
    expect(merged.artwork.sprites).toHaveLength(8);
  });
});
