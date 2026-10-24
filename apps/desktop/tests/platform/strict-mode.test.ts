/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { setPlatform } from '../../src/platform-preset/set-platform';
import { setStrict } from '../../src/platform-preset/set-strict';
import { artworkOf, chosen, platformFile, revisionOf, run, strictSnes } from './platform-harness';
import type { PlatformFile } from './platform-harness';

const failure = (file: PlatformFile, name: string, options: object) => {
  const done = run(file, name, options);
  if (done.ok) throw new Error('the change was not blocked');
  return done.error;
};

describe('the strict switch of a file', () => {
  it('is off by default and turns on and off as one undo step each', () => {
    const file = platformFile(chosen('snes-sprite'));
    expect(artworkOf(file).platformStrict).toBeUndefined();
    setStrict(file.host, file.documentId, true);
    expect(artworkOf(file).platformStrict).toBe(true);
    file.host.undo(file.documentId);
    expect(artworkOf(file).platformStrict).toBeUndefined();
    file.host.redo(file.documentId);
    setStrict(file.host, file.documentId, false);
    expect(artworkOf(file).platformStrict).toBeUndefined();
  });

  it('goes away with the platform', () => {
    const file = strictSnes();
    setPlatform(file.host, file.documentId, 'none');
    expect(artworkOf(file).platformStrict).toBeUndefined();
    expect(artworkOf(file).platformId).toBeUndefined();
  });

  it('stays on when the platform changes, and the change is allowed', () => {
    const file = strictSnes();
    expect(setPlatform(file.host, file.documentId, 'nes-sprite')).toEqual({ ok: true });
    expect(artworkOf(file).platformStrict).toBe(true);
  });
});

describe('a strict file', () => {
  it('blocks a palette size the platform does not have, with a plain notice, and changes nothing', () => {
    const file = strictSnes();
    const before = revisionOf(file);
    const error = failure(file, COMMAND_NAME.paletteResize, { bankId: artworkOf(file).banks[0]?.id, cap: 32 });
    expect(error.code).toBe('PLATFORM_RULE');
    const name = artworkOf(file).banks[0]?.name ?? '';
    expect(error.message).toBe(
      `Blocked by the platform rules. ${name} holds 32 slots. SNES sprite 4bpp uses 16. Turn off Enforce platform rules to allow it.`,
    );
    expect(revisionOf(file)).toBe(before);
    expect(artworkOf(file).banks[0]?.cap).toBe(16);
  });

  it('lets the same change through once the switch is off', () => {
    const file = strictSnes();
    setStrict(file.host, file.documentId, false);
    expect(run(file, COMMAND_NAME.paletteResize, { bankId: artworkOf(file).banks[0]?.id, cap: 32 }).ok).toBe(true);
  });

  it('blocks a colour that is off the platform grid and allows one on it', () => {
    const file = strictSnes();
    const bank = artworkOf(file).banks[0];
    const swatchId = bank?.slots[1]?.id;
    const off = failure(file, COMMAND_NAME.swatchUpdate, { bankId: bank?.id, swatchId, rgb: '#010203' });
    expect(off.message).toContain('1 colour is not on the SNES sprite 4bpp colour grid');
    expect(run(file, COMMAND_NAME.swatchUpdate, { bankId: bank?.id, swatchId, rgb: '#080808' }).ok).toBe(true);
  });

});

describe('a strict file and the other rules', () => {
  it('blocks a sprite of a size the platform cannot draw', () => {
    const file = strictSnes();
    const error = failure(file, COMMAND_NAME.spriteCreate, { name: 'odd', width: 10, height: 10 });
    expect(error.message).toContain('10x10 is not an allowed size for SNES sprite 4bpp');
    expect(run(file, COMMAND_NAME.spriteCreate, { name: 'fine', width: 16, height: 16 }).ok).toBe(true);
  });

  it('blocks a palette past the count the platform allows', () => {
    const file = strictSnes();
    expect(artworkOf(file).banks).toHaveLength(8);
    const error = failure(file, 'palette.create', { name: 'Ninth', cap: 16, transparent: true, colors: ['#080808'] });
    expect(error.message).toContain('The file has 9 palettes. SNES sprite 4bpp allows 8.');
  });

  it('blocks a request from the MCP side in the same way', () => {
    const file = strictSnes();
    const bankId = artworkOf(file).banks[0]?.id;
    const done = file.host.execute({
      documentId: file.documentId,
      baseRevision: revisionOf(file),
      mode: 'commit',
      origin: 'mcp',
      label: 'Resize',
      steps: [{ name: COMMAND_NAME.paletteResize, targets: null, options: { bankId, cap: 64 } }],
      previewPixels: 0,
    });
    expect(done.ok).toBe(false);
  });

  it('turns on over a file that already breaks a rule, and blocks only a worse break', () => {
    const file = platformFile(chosen('snes-sprite'));
    const bank = artworkOf(file).banks[0];
    const first = bank?.slots[1]?.id;
    const second = bank?.slots[2]?.id;
    expect(run(file, COMMAND_NAME.swatchUpdate, { bankId: bank?.id, swatchId: first, rgb: '#010203' }).ok).toBe(true);
    expect(setStrict(file.host, file.documentId, true)).toEqual({ ok: true });
    expect(failure(file, COMMAND_NAME.swatchUpdate, { bankId: bank?.id, swatchId: second, rgb: '#020304' }).code).toBe('PLATFORM_RULE');
    expect(run(file, COMMAND_NAME.swatchUpdate, { bankId: bank?.id, swatchId: first, rgb: '#080808' }).ok).toBe(true);
  });

  it('does not block anything on a file without the switch', () => {
    const file = platformFile(chosen('snes-sprite'));
    expect(run(file, COMMAND_NAME.spriteCreate, { name: 'odd', width: 10, height: 10 }).ok).toBe(true);
  });
});
