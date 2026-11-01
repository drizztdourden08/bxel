/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import type { AssetRow } from '../../src/asset-list/asset-list.type';
import { compareEntries } from '../../src/project-browser/compare-entries';
import { matchEntry } from '../../src/project-browser/match-entry';
import { parseQuery } from '../../src/project-browser/parse-query';
import { BUILT_IN_FILTERS, NO_FACTS, SORT_OPTIONS } from '../../src/project-browser/project-browser.constants';
import type { BrowserFacts, FileEntry } from '../../src/project-browser/project-browser.type';
import { withHealthFlags } from '../../src/project-browser/with-health-flags';
import { EMPTY_REPORT } from '../../src/project-health/project-health.constants';
import type { HealthState } from '../../src/project-health/project-health.type';

const DAY = 86_400_000;

const row = (name: string, modified: number, created: number | null = null): AssetRow => ({
  id: `/p/${name}`,
  kind: 'sprite',
  assetId: null,
  name,
  path: `/p/${name}.bxel`,
  folder: 'p',
  modified,
  created,
  dirty: false,
  loaded: true,
  usedBy: [],
  preview: null,
});

const entry = (base: AssetRow, facts: Partial<BrowserFacts> = {}): FileEntry => ({ kind: 'file', id: base.id, row: base, facts: { ...NO_FACTS, ...facts }, pinned: false, key: null });

const ready = (report: Partial<typeof EMPTY_REPORT>): HealthState => ({ status: 'ready', report: { ...EMPTY_REPORT, ...report }, index: { files: [], links: [], duplicates: [] } });

describe('K1 the smart filters of the Browse window', { tags: ['critical'] }, () => {
  it('ships Recently changed, Broken links and Outside its role folder beside the older ones', () => {
    const names = BUILT_IN_FILTERS.map((filter) => filter.name);
    expect(names).toEqual(expect.arrayContaining(['Unsaved', 'Recently changed', 'Unused', 'Broken links', 'Outside its role folder']));
    expect(BUILT_IN_FILTERS.every((filter) => parseQuery(filter.query).is.length === 1)).toBe(true);
  });

  it('keeps a file changed in the last week under is:recent', () => {
    const fresh = entry(row('fresh', Date.now() - DAY));
    const stale = entry(row('stale', Date.now() - 30 * DAY));
    const query = parseQuery('is:recent');
    expect(matchEntry(fresh, query)).toBe(true);
    expect(matchEntry(stale, query)).toBe(false);
  });

  it('keeps files with a broken link under is:broken and strays under is:misplaced', () => {
    const broken = entry(row('broken', 0), { broken: true });
    const strayed = entry(row('strayed', 0), { misplaced: true });
    const fine = entry(row('fine', 0));
    expect(parseQuery('is:broken').chips.map((chip) => chip.text)).toEqual(['is:broken']);
    expect([broken, strayed, fine].filter((each) => matchEntry(each, parseQuery('is:broken'))).map((each) => each.row.name)).toEqual(['broken']);
    expect([broken, strayed, fine].filter((each) => matchEntry(each, parseQuery('is:misplaced'))).map((each) => each.row.name)).toEqual(['strayed']);
  });

  it('marks the files named by the health report and changes nothing while it is not ready', () => {
    const rows = [row('a', 0), row('b', 0)];
    const facts = new Map(rows.map((each) => [each.id, NO_FACTS] as const));
    expect(withHealthFlags(facts, rows, { status: 'scanning' })).toBe(facts);
    const flagged = withHealthFlags(facts, rows, ready({ broken: [{ file: '/p/a.bxel' } as never], misplaced: [{ path: '/p/b.bxel' } as never] }));
    expect(flagged.get('/p/a')).toMatchObject({ broken: true, misplaced: false });
    expect(flagged.get('/p/b')).toMatchObject({ broken: false, misplaced: true });
  });
});

describe('K1 the sort keys of the Browse window', { tags: ['critical'] }, () => {
  it('offers Date created and Colours', () => {
    const values = SORT_OPTIONS.map((option) => option.value);
    expect(values).toEqual(expect.arrayContaining(['created', 'colours']));
  });

  it('orders by the date created and by the colours used', () => {
    const old = entry(row('old', 0, 100), { colours: 4 });
    const young = entry(row('young', 0, 900), { colours: 32 });
    expect([young, old].sort(compareEntries('created')).map((each) => each.row.name)).toEqual(['old', 'young']);
    expect([young, old].sort(compareEntries('colours')).map((each) => each.row.name)).toEqual(['old', 'young']);
  });
});
