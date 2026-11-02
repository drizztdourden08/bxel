/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { lospecSlug } from '../../src/palette-import/lospec-slug';
import { lospecUrl } from '../../src/palette-import/lospec.constants';
import { readLospec } from '../../src/palette-import/read-lospec';

describe('Lospec palette import by link or slug', { tags: ['standard'] }, () => {
  it('finds the slug in a page link, a palette link and a bare name', () => {
    expect(lospecSlug('https://lospec.com/palette-list/sweetie-16')).toBe('sweetie-16');
    expect(lospecSlug('lospec.com/palette-list/Sweetie-16.json')).toBe('sweetie-16');
    expect(lospecSlug('lospec-palette://pico-8')).toBe('pico-8');
    expect(lospecSlug('  endesga-32 ')).toBe('endesga-32');
  });

  it('refuses links to other hosts and text that is not one name', () => {
    expect(lospecSlug('https://example.com/palette-list/sweetie-16')).toBeNull();
    expect(lospecSlug('#4a7a3c\n#a7f070')).toBeNull();
    expect(lospecSlug('two words')).toBeNull();
    expect(lospecSlug('')).toBeNull();
  });

  it('builds the json address on the one allowed host', () => {
    expect(lospecUrl('pico-8')).toBe('https://lospec.com/palette-list/pico-8.json');
  });

  it('reads the name, the author and the colours of the json answer', () => {
    const source = readLospec(JSON.stringify({ name: 'Tiny', author: 'Someone', colors: ['1a1c2c', '5d275d', 'ffffff'] }));
    expect(source?.name).toBe('Tiny');
    expect(source?.author).toBe('Someone');
    expect(source?.colors.map((colour) => colour.rgb)).toHaveLength(3);
  });

  it('gives nothing for an answer that is not a palette', () => {
    expect(readLospec('not json')).toBeNull();
    expect(readLospec(JSON.stringify({ name: 'x' }))).toBeNull();
    expect(readLospec(JSON.stringify({ name: 'x', colors: [] }))).toBeNull();
  });
});
