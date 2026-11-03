/* @layer renderer-app @kind test */
import { findBank } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { thumbBox } from '../../src/pixel-thumb/thumb-box';
import { bankSpriteImage } from '../../src/sheet/bank-sprite-image';
import { artwork, openFile, spriteOf } from '../sheet/sheet-harness';

describe('S2 the entry thumbnails are kept by sprite and bank', { tags: ['standard'] }, () => {
  it('builds one picture per sprite and bank and gives the same one again', () => {
    openFile(['hero']);
    const sprite = spriteOf('hero');
    const bank = findBank(artwork(), sprite.bankId);
    const first = bankSpriteImage(bank, sprite);
    expect(first).not.toBeNull();
    expect(bankSpriteImage(bank, sprite)).toBe(first);
  });

  it('builds a new picture when the sprite is another object', () => {
    openFile(['mage']);
    const sprite = spriteOf('mage');
    const bank = findBank(artwork(), sprite.bankId);
    const first = bankSpriteImage(bank, sprite);
    expect(bankSpriteImage(bank, { ...sprite })).not.toBe(first);
  });

  it('gives no picture without a bank', () => {
    openFile(['ghost']);
    expect(bankSpriteImage(undefined, spriteOf('ghost'))).toBeNull();
  });

  it('snaps a thumbnail size down to the nearest box token', () => {
    expect([8, 16, 28, 32, 44, 48, 100, 128].map(thumbBox)).toEqual([16, 16, 24, 32, 40, 48, 64, 64]);
  });
});
