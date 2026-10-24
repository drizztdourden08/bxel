/* @layer tests @kind test */
import { DEFAULT_ENTRY_KINDS, listEntries } from '@bxel/project';
import type { RawEntry } from '@bxel/project';
import { describe, expect, it } from 'vitest';

const file = (name: string, size = 10, modified = 1000): RawEntry => ({ name, kind: 'file', size, modified });

const folder = (name: string): RawEntry => ({ name, kind: 'folder', size: 0, modified: 0 });

const options = { kinds: DEFAULT_ENTRY_KINDS, offset: 0, limit: 200 };

describe('file kinds', () => {
  it('lists each file with its entry kind', () => {
    const names = ['a.bxsprite', 'a.bxel', 'a.PNG', 'a.gpl', 'a.json'];
    expect(listEntries(names.map((name) => file(name)), options).entries.map((entry) => [entry.name, entry.kind])).toEqual([
      ['a.bxel', 'legacy'],
      ['a.bxsprite', 'sprite'],
      ['a.gpl', 'palette'],
      ['a.json', 'data'],
      ['a.PNG', 'image'],
    ]);
  });
});

describe('a folder listing', () => {
  it('puts folders first, then files by name, ignoring case', () => {
    const listed = listEntries([file('b.bxel'), folder('old'), file('A.bxel'), folder('Art')], options);
    expect(listed.entries.map((entry) => entry.name)).toEqual(['Art', 'old', 'A.bxel', 'b.bxel']);
    expect(listed.total).toBe(4);
  });

  it('counts names that break the path rules in skipped and never lists them', () => {
    const listed = listEntries([file('hero.bxel'), file('CON.png'), file('.hidden.bxel'), file('Dungeon.bxelproject'), file('x.bxel.tmp-1')], options);
    expect(listed.entries.map((entry) => entry.name)).toEqual(['hero.bxel']);
    expect(listed.skipped).toBe(4);
  });

  it('keeps only the asked kinds for files and always keeps folders', () => {
    const listed = listEntries([file('a.bxel'), file('b.png'), file('c.txt'), folder('sub')], { ...options, kinds: ['image'] });
    expect(listed.entries.map((entry) => entry.name)).toEqual(['sub', 'b.png']);
    expect(listed.skipped).toBe(0);
  });

  it('lists other files when asked', () => {
    const listed = listEntries([file('c.txt')], { ...options, kinds: ['other'] });
    expect(listed.entries).toEqual([{ name: 'c.txt', kind: 'other', bytes: 10, modified: 1000 }]);
  });

  it('pages by offset and limit and says when more is left', () => {
    const many = Array.from({ length: 5 }, (_unused, at) => file(`f${at}.bxel`));
    const first = listEntries(many, { ...options, limit: 2 });
    expect(first.entries.map((entry) => entry.name)).toEqual(['f0.bxel', 'f1.bxel']);
    expect(first.truncated).toBe(true);
    const last = listEntries(many, { ...options, offset: 4, limit: 2 });
    expect(last.entries.map((entry) => entry.name)).toEqual(['f4.bxel']);
    expect(last.truncated).toBe(false);
    expect(last.total).toBe(5);
  });

  it('carries the size and modified time of a file', () => {
    expect(listEntries([file('a.bxel', 42, 7)], options).entries).toEqual([{ name: 'a.bxel', kind: 'legacy', bytes: 42, modified: 7 }]);
  });
});
