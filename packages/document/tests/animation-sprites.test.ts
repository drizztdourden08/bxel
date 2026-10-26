/* @layer core @kind test */
import { assetsTouched, spriteOwners } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { animationNamed, apply, buildAnimWorld, createdAnimation, refuse } from './anim-engine';
import { step } from './tile-engine';

const target = (sprite: string) => ({ sprites: [sprite as never], layers: { by: 'all' }, frames: { by: 'all' } }) as const;
const at = (index: number) => ({ by: 'index', index }) as const;

describe('deleting a sprite an animation uses', () => {
  it('asks for a confirmation, then empties the frames', () => {
    const { engine, a, b } = buildAnimWorld();
    createdAnimation(engine, [step('animation.create', { name: 'walk', source: { kind: 'sprites', sprites: [a, b, a] } }, 'anim')]);
    const del = (options: unknown) => ({ ...step('sprite.delete', options), targets: target(a) });
    const error = refuse(engine, [del({})]);
    expect(error.code).toBe('ANIMATION_IN_USE');
    expect(error.message).toContain('"walk"');
    const done = apply(engine, [del({ detachAnimations: true })]);
    expect(animationNamed(engine, 'walk').frames.map((frame) => frame.spriteId)).toEqual([null, b, null]);
    expect(done.report['frames']).toBe(2);
    expect(done.warnings.map((warning) => warning.code)).toEqual(['FRAMES_EMPTIED']);
  
  });

  it('keeps the clip rule: an emptied frame has no clip', () => {
    const { engine, strip } = buildAnimWorld();
    createdAnimation(engine, [step('animation.create', { name: 'spin', source: { kind: 'strip', sprite: strip, grid: { columns: 4, rows: 1 } } }, 'anim')]);
    apply(engine, [{ ...step('sprite.delete', { detachAnimations: true }), targets: target(strip) }]);
    expect(animationNamed(engine, 'spin').frames.every((frame) => frame.clip === null && frame.spriteId === null)).toBe(true);
  });

  it('refuses to delete, duplicate or place on a sheet a sprite an animation owns', () => {
    const { engine, a } = buildAnimWorld();
    createdAnimation(engine, [step('animation.create', { name: 'walk', source: { kind: 'sprite', sprite: a, mode: 'copy' } }, 'anim')]);
    const owned = engine.state().artwork.sprites.find((sprite) => sprite.role === 'frame');
    const targeted = (name: string, options: unknown) => ({ ...step(name, options), targets: target(owned?.id ?? '') });
    expect(refuse(engine, [targeted('sprite.delete', {})]).code).toBe('SPRITE_OWNED');
    expect(refuse(engine, [targeted('sprite.duplicate', {})]).code).toBe('INVALID_OPTION');
    apply(engine, [step('sheet.create', { name: 'sheet' }, 'sheet')]);
    const sheet = engine.state().artwork.sheets[0]?.id;
    expect(refuse(engine, [step('sheet.add', { sheet, sprites: [owned?.id] })]).code).toBe('INVALID_OPTION');
  });

  it('removes the sprites an animation owns when its frames or the animation go', () => {
    const { engine, a, b } = buildAnimWorld();
    const id = createdAnimation(engine, [step('animation.create', { name: 'walk', source: { kind: 'sprites', sprites: [a, b], mode: 'copy' } }, 'anim')]);
    const owned = () => engine.state().artwork.sprites.filter((sprite) => sprite.role === 'frame').length;
    expect(owned()).toBe(2);
    apply(engine, [step('animation.frame.delete', { animation: id, frames: [at(0)] })]);
    expect(owned()).toBe(1);
    apply(engine, [step('animation.delete', { animation: id })]);
    expect(owned()).toBe(0);
  });
});

describe('spriteOwners and assetsTouched', () => {
  it('names the animation as the owner of its frame sprites only', () => {
    const { engine, a, b } = buildAnimWorld();
    const id = createdAnimation(engine, [step('animation.create', { name: 'walk', source: { kind: 'sprites', sprites: [a, b], mode: 'copy' } }, 'anim')]);
    apply(engine, [step('animation.frame.add', { animation: id, source: { kind: 'sprite', sprite: b } })]);
    const owners = spriteOwners(engine.state().artwork);
    const frames = animationNamed(engine, 'walk').frames;
    expect(owners.get(frames[0]?.spriteId ?? '')).toBe(id);
    expect(owners.get(frames[1]?.spriteId ?? '')).toBe(id);
    expect(owners.has(b)).toBe(false);
    expect(owners.size).toBe(2);
  });

  it('keys a new animation and the sprites it owns to the animation', () => {
    const { engine, a } = buildAnimWorld();
    const before = engine.state().artwork;
    const done = apply(engine, [step('animation.create', { name: 'walk', source: { kind: 'sprite', sprite: a, mode: 'copy' } }, 'anim')]);
    expect(assetsTouched(done.changes, before, engine.state().artwork)).toEqual([{ kind: 'animation', id: done.created['anim'] }]);
    const owned = engine.state().artwork.sprites.find((sprite) => sprite.role === 'frame');
    const mid = engine.state().artwork;
    const edit = apply(engine, [{ ...step('pixels.patch', { rect: { x: 0, y: 0, width: 1, height: 1 }, pixels: new Uint8Array([9]) }), targets: target(owned?.id ?? '') }]);
    expect(assetsTouched(edit.changes, mid, engine.state().artwork).map((key) => key.kind)).toEqual(['animation']);
  });

  it('lists the tileset as the owner of a tile sprite and the sprite itself for a project sprite', () => {
    const { engine, a } = buildAnimWorld();
    const before = engine.state().artwork;
    const done = apply(engine, [step('tileset.create', { name: 'ground', tileWidth: 4, tileHeight: 4 }, 'ts'), step('tile.add', { tileset: { ref: 'ts' } })]);
    const touched = assetsTouched(done.changes, before, engine.state().artwork);
    expect(touched.map((key) => key.kind).sort()).toEqual(['tileset']);
    const edit = apply(engine, [{ ...step('pixels.patch', { rect: { x: 0, y: 0, width: 1, height: 1 }, pixels: new Uint8Array([9]) }), targets: { ...target(a), layers: { by: 'all' } } }]);
    expect(assetsTouched(edit.changes, before, engine.state().artwork).map((key) => key.kind)).toEqual(['sprite']);
  });
});
