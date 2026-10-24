/* @layer core @kind test */
import { counterIdSource, forkIdSource, ID_PREFIX, isId, randomIdSource } from '@bxel/document';
import { describe, expect, it } from 'vitest';

describe('id sources', () => {
  it('counts with one shared counter', () => {
    const ids = counterIdSource();
    expect(ids.next('art')).toBe('art_000001');
    expect(ids.next('bnk')).toBe('bnk_000002');
    expect(ids.next('sw')).toBe('sw_000003');
  });

  it('forks without advancing the parent', () => {
    const ids = counterIdSource();
    ids.next('art');
    const fork = forkIdSource(ids);
    expect(fork.next('spr')).toBe('spr_000002');
    expect(fork.next('spr')).toBe('spr_000003');
    expect(ids.next('spr')).toBe('spr_000002');
  });

  it('draws random ids from the injected byte provider', () => {
    const bytes = (length: number): Uint8Array => Uint8Array.from({ length }, (_, index) => index * 3);
    const ids = randomIdSource(bytes);
    const id = ids.next('spr');
    expect(id).toBe('spr_0369cfjnrvy1');
    expect(isId(id, 'spr')).toBe(true);
  });

  it('accepts only well formed ids of the right kind', () => {
    const bytes = (length: number): Uint8Array => Uint8Array.from({ length }, (_, index) => index + 1);
    const id = randomIdSource(bytes).next(ID_PREFIX.sprite);
    expect(id).toMatch(/^spr_[0-9a-hjkmnp-tv-z]{12}$/);
    expect(isId(id, 'spr')).toBe(true);
    expect(isId(id, 'lay')).toBe(false);
    expect(isId('spr_000001', 'spr')).toBe(true);
    expect(isId('spr_00000i', 'spr')).toBe(false);
    expect(isId('spr_001', 'spr')).toBe(false);
  });
});
