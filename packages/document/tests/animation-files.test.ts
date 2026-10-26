/* @layer core @kind test */
import type { Artwork, AssetKind, SplitFile } from '@bxel/document';
import { counterIdSource, mergeSlices, splitAnimatedSprites, splitIntoAssets } from '@bxel/document';
import { decodeAnimation, decodeSheet, decodeTileset, gateVersions, readAssetManifest } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';
import { animatedArtwork, pathsOf } from './animated-fixture';
import { decodeFiles, encodeSlice } from './asset-bytes';

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
  animations: byId(artwork.animations),
});

const migrated = (): Artwork => {
  const before = animatedArtwork();
  return splitAnimatedSprites(before, pathsOf(before), counterIdSource(7000)).artwork;
};

const ofKind = (files: readonly SplitFile[], kind: AssetKind): SplitFile[] => files.filter((file) => file.key.kind === kind);

const bytesOf = (file: SplitFile): Uint8Array => encodeSlice(file.slice);

describe('animation files', () => {
  it('are split out of the artwork, one per animation, beside the sprites', () => {
    const plan = splitIntoAssets(migrated());
    const animations = ofKind(plan.files, 'animation');
    expect(animations).toHaveLength(3);
    expect(animations.every((file) => file.path.startsWith('sprites/') && file.path.endsWith('.bxanim'))).toBe(true);
    const owned = animations.flatMap((file) => file.slice.artwork.sprites ?? []);
    expect(owned.every((sprite) => sprite.role === 'frame')).toBe(true);
    expect(ofKind(plan.files, 'sprite').flatMap((file) => file.slice.artwork.sprites ?? []).some((sprite) => sprite.role === 'frame')).toBe(false);
  });

  it('round trip through bytes, rebuild the artwork and rewrite the same bytes', () => {
    const artwork = migrated();
    const plan = splitIntoAssets(artwork);
    const stored = plan.files.map((file) => ({ path: file.path, bytes: bytesOf(file) }));
    const { sources, reports } = decodeFiles(stored);
    expect(reports.map((report) => report.issues)).toEqual(reports.map(() => []));
    expect(reports.every((report) => report.outcome === 'ok')).toBe(true);
    const merged = mergeSlices(sources, counterIdSource(5000), plan.project);
    expect(merged.issues).toEqual([]);
    expect(merged.rekeyed).toEqual([]);
    expect(normal(merged.artwork)).toEqual(normal(artwork));
    for (const [index, file] of plan.files.entries()) {
      const source = sources.find((item) => item.path === file.path);
      expect(source && encodeSlice(source.slice)).toEqual(stored[index]?.bytes);
    }
  });

  it('write format and reader version 3 only where the file needs an animation', () => {
    const plan = splitIntoAssets(migrated());
    const versions = (kind: AssetKind): number[] =>
      ofKind(plan.files, kind).map((file) => {
        const manifest = readAssetManifest(bytesOf(file));
        return manifest?.minReaderVersion === manifest?.formatVersion ? (manifest?.minReaderVersion ?? 0) : -1;
      });
    expect(versions('animation')).toEqual([3, 3, 3]);
    expect(versions('sprite').every((version) => version === 2)).toBe(true);
    expect(versions('palette').every((version) => version === 2)).toBe(true);
    expect(versions('tilemap')).toEqual([2]);
    const sheets = ofKind(plan.files, 'sheet');
    const animated = sheets.filter((file) => (file.slice.artwork.sheets?.[0]?.animationEntries ?? []).length > 0);
    expect(animated.length).toBeGreaterThan(0);
    expect(animated.map((file) => readAssetManifest(bytesOf(file))?.minReaderVersion)).toEqual(animated.map(() => 3));
    const plain = sheets.filter((file) => !animated.includes(file));
    expect(plain.map((file) => readAssetManifest(bytesOf(file))?.minReaderVersion)).toEqual(plain.map(() => 2));
    const tilesets = ofKind(plan.files, 'tileset');
    expect(tilesets.map((file) => readAssetManifest(bytesOf(file))?.minReaderVersion)).toEqual([3]);
  });

  it('are refused by a reader that stops at version 2, when they need version 3', () => {
    const plan = splitIntoAssets(migrated());
    const sheet = ofKind(plan.files, 'sheet').find((file) => (file.slice.artwork.sheets?.[0]?.animationEntries ?? []).length > 0);
    const manifest = readAssetManifest(sheet ? bytesOf(sheet) : new Uint8Array());
    if (!manifest) throw new Error('No manifest.');
    expect(gateVersions(manifest, 2).issue?.code).toBe('VERSION_TOO_NEW');
    expect(gateVersions(manifest, 3).issue).toBeNull();
    const sprite = ofKind(plan.files, 'sprite')[0];
    const plain = readAssetManifest(sprite ? bytesOf(sprite) : new Uint8Array());
    expect(plain && gateVersions(plain, 2)).toMatchObject({ issue: null, readOnly: false });
  });
});

describe('animation links', () => {
  it('open with placeholders when the animation file is missing from a sheet or a tileset', () => {
    const plan = splitIntoAssets(migrated());
    const sheet = ofKind(plan.files, 'sheet').find((file) => (file.slice.artwork.sheets?.[0]?.animationEntries ?? []).length > 0);
    const tileset = ofKind(plan.files, 'tileset')[0];
    if (!sheet || !tileset) throw new Error('The fixture has an animated sheet and tileset.');
    const missingSheet = decodeSheet(bytesOf(sheet), []);
    expect(missingSheet.outcome).toBe('recoverable');
    const wanted = sheet.slice.artwork.sheets?.[0]?.animationEntries?.[0]?.animationId;
    expect(missingSheet.slice?.artwork.animations?.map((animation) => animation.id)).toEqual([wanted]);
    const missingTiles = decodeTileset(bytesOf(tileset), null, []);
    expect(missingTiles.outcome).toBe('recoverable');
    const [placeholder] = missingTiles.slice?.artwork.animations ?? [];
    const tile = missingTiles.slice?.artwork.tilesets?.[0]?.tiles.find((item) => item.animation);
    expect([placeholder?.id, placeholder?.width]).toEqual([tile?.animation?.animationId, 2]);
  });

  it('open with a placeholder sprite when a linked sprite file is missing', () => {
    const artwork = migrated();
    const hero = artwork.animations.find((animation) => animation.name === 'Hero');
    const project = artwork.sprites.find((sprite) => sprite.name === 'hero');
    if (!hero || !project) throw new Error('The fixture has them.');
    const frames = hero.frames.map((frame, index) => (index === 0 ? { ...frame, spriteId: project.id } : frame));
    const changed = { ...artwork, animations: artwork.animations.map((item) => (item.id === hero.id ? { ...hero, frames } : item)) };
    const file = ofKind(splitIntoAssets(changed).files, 'animation').find((item) => item.name === 'Hero');
    if (!file) throw new Error('No animation file.');
    expect(file.slice.links.some((link) => link.id === project.id)).toBe(true);
    const bytes = bytesOf(file);
    const supplied = decodeAnimation(bytes, null, [ofKind(splitIntoAssets(changed).files, 'sprite').find((item) => item.name === 'hero')?.slice ?? file.slice]);
    expect(supplied.missingLinks.map((link) => link.id)).not.toContain(project.id);
    const lacking = decodeAnimation(bytes, null, []);
    expect(lacking.outcome).toBe('recoverable');
    expect(lacking.slice?.artwork.sprites?.some((sprite) => sprite.id === project.id && sprite.role === 'sprite')).toBe(true);
  });
});
