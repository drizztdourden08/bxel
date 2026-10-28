/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import type { AssetRow } from '../../src/asset-list/asset-list.type';
import { isSearching } from '../../src/project-browser/is-searching';
import { matchEntry } from '../../src/project-browser/match-entry';
import { parseQuery } from '../../src/project-browser/parse-query';
import { NO_FACTS } from '../../src/project-browser/project-browser.constants';
import type { BrowserFacts, FileEntry } from '../../src/project-browser/project-browser.type';

const row = (name: string, kind: AssetRow['kind'], folder: string, dirty = false): AssetRow => ({
  id: `/p/${folder}/${name}`,
  kind,
  assetId: null,
  name,
  path: `/p/${folder}/${name}.bx`,
  folder,
  modified: 0,
  created: null,
  dirty,
  loaded: true,
  usedBy: [],
  preview: null,
});

const entry = (base: AssetRow, facts: Partial<BrowserFacts> = {}, pinned = false): FileEntry => ({
  kind: 'file',
  id: base.id,
  row: base,
  facts: { ...NO_FACTS, ...facts },
  pinned,
  key: null,
});

describe('the search grammar of the project browser', () => {
  it('turns tokens into chips and leaves plain words as words', () => {
    const query = parseQuery('hero kind:sprite is:unsaved');
    expect(query.words).toEqual(['hero']);
    expect(query.kinds).toEqual(['sprite']);
    expect(query.is).toEqual(['unsaved']);
    expect(query.chips.map((chip) => chip.text)).toEqual(['kind:sprite', 'is:unsaved']);
  });

  it('knows nothing is being searched until something is typed', () => {
    expect(isSearching(parseQuery(''))).toBe(false);
    expect(isSearching(parseQuery('   '))).toBe(false);
    expect(isSearching(parseQuery('in:sprites'))).toBe(true);
  });

  it('adds kinds together and narrows with every other token', () => {
    const sprite = entry(row('hero', 'sprite', 'sprites', true));
    const sheet = entry(row('walk', 'sheet', 'sheets'));
    const kinds = parseQuery('kind:sprite kind:sheet');
    expect(matchEntry(sprite, kinds)).toBe(true);
    expect(matchEntry(sheet, kinds)).toBe(true);
    const unsavedSprites = parseQuery('kind:sprite is:unsaved');
    expect(matchEntry(sprite, unsavedSprites)).toBe(true);
    expect(matchEntry(sheet, unsavedSprites)).toBe(false);
  });

  it('matches the folder, and the size and colour tests', () => {
    const big = entry(row('hero', 'sprite', 'sprites'), { width: 64, height: 32, colours: 8 });
    expect(matchEntry(big, parseQuery('in:sprites'))).toBe(true);
    expect(matchEntry(big, parseQuery('in:sheets'))).toBe(false);
    expect(matchEntry(big, parseQuery('size>32'))).toBe(true);
    expect(matchEntry(big, parseQuery('size>64'))).toBe(false);
    expect(matchEntry(big, parseQuery('colours<16'))).toBe(true);
    expect(matchEntry(big, parseQuery('colours<8'))).toBe(false);
  });

  it('finds files by what they use and what uses them, and flags the unused', () => {
    const sprite = entry(row('hero', 'sprite', 'sprites'), { usedBy: ['walk'] });
    const loose = entry(row('spare', 'sprite', 'sprites'));
    const sheet = entry(row('walk', 'sheet', 'sheets'), { uses: ['hero'] });
    expect(matchEntry(sheet, parseQuery('uses:hero'))).toBe(true);
    expect(matchEntry(loose, parseQuery('uses:hero'))).toBe(false);
    expect(matchEntry(sprite, parseQuery('usedby:walk'))).toBe(true);
    expect(matchEntry(loose, parseQuery('usedby:walk'))).toBe(false);
    expect(matchEntry(sprite, parseQuery('is:unused'))).toBe(false);
    expect(matchEntry(loose, parseQuery('is:unused'))).toBe(true);
  });

  it('reads a quoted name as one token', () => {
    const query = parseQuery('uses:"big hero"');
    expect(query.uses).toEqual(['big hero']);
  });

  it('keeps pinned and open as flags', () => {
    const pinned = entry(row('hero', 'sprite', 'sprites'), {}, true);
    const opened = entry(row('walk', 'sheet', 'sheets'), { open: true });
    expect(matchEntry(pinned, parseQuery('is:pinned'))).toBe(true);
    expect(matchEntry(opened, parseQuery('is:pinned'))).toBe(false);
    expect(matchEntry(opened, parseQuery('is:open'))).toBe(true);
  });
});
