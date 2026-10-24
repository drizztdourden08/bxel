/* @layer tests @kind test */
import type { Tileset } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { makeNoiseImage } from './make-noise-image';
import { execute, makeRig, rejectionCode, step, succeed } from './palette-engine';
import type { Rig } from './palette-engine';
import { redoLast, undoLast } from './import-helpers';

const tileOf = (seed: number, size = 2) => {
  const image = makeNoiseImage(size, seed);
  return { image: { width: image.width, height: image.height, rgba: Uint8Array.from(image.data) } };
};

const importStep = (rig: Rig, options: object = {}) =>
  step('tileset.import', { name: 'ground', tileWidth: 2, tileHeight: 2, bank: { bankId: rig.bankId }, tiles: [tileOf(1), tileOf(2), tileOf(3)], ...options });

const tilesetOf = (rig: Rig): Tileset => {
  const found = rig.engine.state().artwork.tilesets[0];
  if (!found) throw new Error('no tileset');
  return found;
};

describe('tileset.import', () => {
  it('creates a tileset whose tiles are tile sprites keyed in order and mapped to the bank', () => {
    const rig = makeRig();
    const result = succeed(execute(rig, [{ ...importStep(rig), ref: 'set' }]));
    const tileset = tilesetOf(rig);
    expect(result.ok && result.created['set']).toBe(tileset.id);
    expect(tileset.tiles.map((tile) => tile.key)).toEqual([1, 2, 3]);
    expect(tileset.nextKey).toBe(4);
    const sprites = rig.engine.state().artwork.sprites.filter((sprite) => sprite.role === 'tile');
    expect(sprites).toHaveLength(3);
    const slots = rig.engine.state().artwork.banks.find((bank) => bank.id === rig.bankId)?.slots.length ?? 0;
    for (const sprite of sprites) {
      const pixels = Object.values(sprite.cels)[0]?.pixels ?? new Uint8Array();
      expect([sprite.width, sprite.height, sprite.bankId]).toEqual([2, 2, rig.bankId]);
      expect(pixels.every((index) => index < slots)).toBe(true);
    }
  });

  it('is one undo step and redoes to the same tileset', () => {
    const rig = makeRig();
    const before = rig.engine.state().artwork.tilesets.length;
    succeed(execute(rig, [importStep(rig)]));
    expect(undoLast(rig).ok).toBe(true);
    expect(rig.engine.state().artwork.tilesets).toHaveLength(before);
    expect(rig.engine.state().artwork.sprites.filter((sprite) => sprite.role === 'tile')).toHaveLength(0);
    expect(redoLast(rig).ok).toBe(true);
    expect(tilesetOf(rig).tiles).toHaveLength(3);
  });

  it('refuses a tile of the wrong size and leaves the file unchanged', () => {
    const rig = makeRig();
    const revision = rig.engine.state().revision;
    const code = rejectionCode(rig, () => execute(rig, [importStep(rig, { tiles: [tileOf(1), tileOf(2, 3)] })]));
    expect(code).toBe('INVALID_OPTION');
    expect(rig.engine.state().revision).toBe(revision);
    expect(rig.engine.state().artwork.tilesets).toHaveLength(0);
  });

  it('refuses a duplicate tileset name', () => {
    const rig = makeRig();
    succeed(execute(rig, [importStep(rig)]));
    expect(rejectionCode(rig, () => execute(rig, [importStep(rig)]))).toBe('NAME_TAKEN');
  });
});
