/* @layer core @kind test */
import type { Artwork, DocumentId } from '@bxel/document';
import { counterIdSource, createEngine, documentCommands, legacyFrameCommands, splitAnimatedSprites } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { animatedArtwork, HERO, pathsOf } from './animated-fixture';
import { brand } from './fixture-to-artwork';
import { step } from './tile-engine';

const migrate = () => {
  const artwork = animatedArtwork();
  return { before: artwork, after: splitAnimatedSprites(artwork, pathsOf(artwork), counterIdSource(7000)) };
};

const named = (artwork: Artwork, name: string) => {
  const found = artwork.animations.find((animation) => animation.name === name);
  if (!found) throw new Error(`No animation ${name}.`);
  return found;
};

const ownedBy = (artwork: Artwork, animation: ReturnType<typeof named>) =>
  artwork.sprites.filter((sprite) => sprite.role === 'frame' && animation.frames.some((frame) => frame.spriteId === sprite.id));

describe('splitAnimatedSprites', () => {
  it('turns every multi frame sprite and multi frame tile into an animation', () => {
    const { before, after } = migrate();
    expect(before.sprites.filter((sprite) => sprite.frames.length > 1)).toHaveLength(3);
    const hero = after.conversions.find((item) => item.spriteId === HERO);
    const tile = after.conversions.find((item) => item.source === 'tile');
    expect([hero?.animationName, hero?.frames, tile?.animationName, tile?.frames]).toEqual(['Hero', 3, 'ground 1', 2]);
    expect(after.conversions).toHaveLength(3);
    expect(after.artwork.animations).toHaveLength(3);
    expect(after.artwork.sprites.some((sprite) => sprite.id === HERO)).toBe(false);
    expect(after.artwork.sprites.filter((sprite) => sprite.frames.length > 1)).toEqual([]);
  });

  it('gives each distinct frame an owned sprite, shares linked frames and copies the layers', () => {
    const { after } = migrate();
    const hero = named(after.artwork, 'Hero');
    expect(new Set(hero.frames.map((frame) => frame.spriteId)).size).toBe(2);
    const owned = ownedBy(after.artwork, hero);
    expect(owned.map((sprite) => sprite.name)).toEqual(['Hero_1', 'Hero_2']);
    expect(owned.every((sprite) => sprite.frames.length === 1 && sprite.layers.length === 1 && sprite.layers[0]?.name === 'Body')).toBe(true);
    expect(hero.frames[2]?.spriteId).toBe(hero.frames[1]?.spriteId);
    expect(hero.tags).toMatchObject([{ kind: 'span', name: 'idle', direction: 'pingpong', from: hero.frames[0]?.id, to: hero.frames[1]?.id }]);
    expect(hero.anchor).toEqual({ x2: 0, y2: 0 });
  });

});

describe('splitAnimatedSprites links and notice', () => {
  it('retargets the sheet, the preset, the paths and the tile', () => {
    const { before, after } = migrate();
    const hero = named(after.artwork, 'Hero');
    const sheet = after.artwork.sheets.find((item) => item.name === 'Characters');
    expect(sheet?.entries.some((entry) => entry.spriteId === HERO)).toBe(false);
    expect(sheet?.animationEntries).toEqual([{ animationId: hero.id, tagId: null, at: { x: 0, y: 0 } }]);
    const preset = after.artwork.presets.find((item) => item.name === 'Characters sheet');
    expect(preset?.scope.sprites).toEqual([hero.frames[0]?.spriteId]);
    expect(after.paths.get(hero.id)).toBe('sprites/Hero.bxanim');
    expect(after.paths.has(HERO)).toBe(false);
    expect(after.trashed).toContain('sprites/Hero.bxsprite');
    expect(after.trashed).toHaveLength(2);
    const ground = named(after.artwork, 'ground 1');
    expect(after.paths.get(ground.id)).toMatch(/^tilemaps\/ground 1\.bxanim$/);
    const tile = after.artwork.tilesets[0]?.tiles[0];
    expect(tile?.animation).toEqual({ animationId: ground.id, tagId: null, start: 'together' });
    expect(before.tilesets[0]?.tiles[0]?.animation).toBeUndefined();
    expect(after.artwork.sprites.find((sprite) => sprite.id === tile?.spriteId)?.frames).toHaveLength(1);
  });

  it('writes the notice the bar shows, and leaves a still artwork alone', () => {
    const { before, after } = migrate();
    expect(after.notice).toBe('3 sprites had frames. They became 3 animations. Save to write them.');
    const still = splitAnimatedSprites(after.artwork, after.paths, counterIdSource(8000));
    expect(still.conversions).toEqual([]);
    expect(still.notice).toBeNull();
    expect(still.artwork).toBe(after.artwork);
    expect(before.animations).toEqual([]);
  });

  it('gives an artwork the engine accepts for further edits', () => {
    const { after } = migrate();
    const engine = createEngine({
      state: { documentId: brand<DocumentId>('doc_000001'), revision: 1, artwork: after.artwork, readOnly: false },
      ids: counterIdSource(9000),
      commands: [...documentCommands, ...legacyFrameCommands],
    });
    const ground = named(after.artwork, 'ground 1');
    const result = engine.execute({
      documentId: engine.documentId,
      baseRevision: 1,
      mode: 'commit',
      origin: 'ui',
      label: 'Rename',
      previewPixels: 0,
      steps: [step('animation.update', { animation: ground.id, name: 'water' })],
    });
    expect(result.ok).toBe(true);
  });
});
