/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { entryName } from '../../src/project-browser/entry-name';
import type { BrowserEntry, BrowserFacts, FileEntry, FolderEntry } from '../../src/project-browser/project-browser.type';
import { typeAheadMatch } from '../../src/project-browser/type-ahead-match';
import { row } from '../panel-browser/browser-fixture';

const FACTS: BrowserFacts = {
  width: null,
  height: null,
  frames: null,
  palette: null,
  colours: null,
  uses: [],
  usedBy: [],
  open: false,
  tags: [],
  collections: [],
  broken: false,
  misplaced: false,
};

const file = (name: string): FileEntry => ({ kind: 'file', id: `/p/${name}`, row: row('sprite', `/p/${name}.bxsprite`), facts: FACTS, pinned: false, key: null });

const folder = (name: string): FolderEntry => ({ kind: 'folder', id: `/p/${name}`, path: `/p/${name}`, name, count: 0, root: false, linked: false });

const ENTRIES: readonly BrowserEntry[] = [folder('Art'), file('apple'), file('ant'), file('boss'), file('bat')];

const idOf = (entry: BrowserEntry | undefined): string | undefined => entry?.id;

describe('S2 type-ahead in Browse', { tags: ['standard'] }, () => {
  it('reads the name of a folder and of a file', () => {
    expect(entryName(ENTRIES[0] as BrowserEntry)).toBe('Art');
    expect(entryName(ENTRIES[1] as BrowserEntry)).toBe('apple');
  });

  it('jumps to the first entry that starts with the letters, ignoring case', () => {
    expect(idOf(typeAheadMatch(ENTRIES, 'bo', null))).toBe('/p/boss');
    expect(idOf(typeAheadMatch(ENTRIES, 'AR', null))).toBe('/p/Art');
  });

  it('cycles through the entries of one letter when it is pressed again', () => {
    expect(idOf(typeAheadMatch(ENTRIES, 'a', null))).toBe('/p/Art');
    expect(idOf(typeAheadMatch(ENTRIES, 'a', '/p/Art'))).toBe('/p/apple');
    expect(idOf(typeAheadMatch(ENTRIES, 'aa', '/p/ant'))).toBe('/p/Art');
  });

  it('finds nothing for letters no name starts with', () => {
    expect(typeAheadMatch(ENTRIES, 'zz', null)).toBeUndefined();
    expect(typeAheadMatch(ENTRIES, '', null)).toBeUndefined();
  });
});
