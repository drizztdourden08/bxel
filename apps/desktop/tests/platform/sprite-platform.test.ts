/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { effectivePlatform } from '../../src/platform-preset/effective-platform';
import { spriteReport } from '../../src/platform-preset/sprite-report';
import { artworkOf, blank, platformFile, revisionOf, run, spriteScope } from './platform-harness';
import type { PlatformFile } from './platform-harness';

const spriteOf = (file: PlatformFile) => {
  const sprite = artworkOf(file).sprites[0];
  if (!sprite) throw new Error('no sprite');
  return sprite;
};

const strictSprite = (): PlatformFile => {
  const file = platformFile({ ...blank(), name: 'hero' });
  const done = run(file, COMMAND_NAME.spriteUpdate, { platformId: 'snes-sprite', platformStrict: true }, spriteScope(spriteOf(file).id));
  if (!done.ok) throw new Error(done.error.message);
  return file;
};

describe('the effective platform of a sprite', () => {
  it('is the sprite platform when it has one, and the project platform otherwise', () => {
    const file = platformFile({ ...blank(), name: 'hero' });
    expect(effectivePlatform(artworkOf(file), spriteOf(file))).toEqual({ platformId: undefined, strict: false, inherited: true });
    run(file, COMMAND_NAME.artworkUpdate, { platformId: 'gb-dmg', platformStrict: true });
    expect(effectivePlatform(artworkOf(file), spriteOf(file))).toEqual({ platformId: 'gb-dmg', strict: true, inherited: true });
    run(file, COMMAND_NAME.spriteUpdate, { platformId: 'nes-sprite' }, spriteScope(spriteOf(file).id));
    expect(effectivePlatform(artworkOf(file), spriteOf(file))).toEqual({ platformId: 'nes-sprite', strict: false, inherited: false });
  });

  it('reports the rules of its own platform', () => {
    const file = strictSprite();
    const report = spriteReport(artworkOf(file), spriteOf(file));
    expect(report?.platformId).toBe('snes-sprite');
    expect(report?.strict).toBe(true);
  });
});

describe('a sprite with strict rules of its own', () => {
  it('blocks a palette change that breaks its platform, and changes nothing', () => {
    const file = strictSprite();
    const before = revisionOf(file);
    const done = run(file, COMMAND_NAME.paletteResize, { bankId: artworkOf(file).banks[0]?.id, cap: 32 });
    expect(done.ok).toBe(false);
    if (!done.ok) expect(done.error.code).toBe('PLATFORM_RULE');
    expect(revisionOf(file)).toBe(before);
  });

  it('lets the same change through once its strict switch is off', () => {
    const file = strictSprite();
    run(file, COMMAND_NAME.spriteUpdate, { platformStrict: false }, spriteScope(spriteOf(file).id));
    expect(run(file, COMMAND_NAME.paletteResize, { bankId: artworkOf(file).banks[0]?.id, cap: 32 }).ok).toBe(true);
  });
});
