/* @layer tests @kind test */
import { parseProjectDocument, PROJECT_ERROR_CODE, readManifest, writeProjectDocument } from '@bxel/project';
import type { ProjectDocument, ProjectOrganise } from '@bxel/project';
import { describe, expect, it } from 'vitest';
import { must } from './must';
import { sampleDocument } from './sample-document';

const organise = (): ProjectOrganise => ({
  tags: { spr_b: ['hero'], spr_a: ['hero', 'player'] },
  collections: [{ id: 'col_1', name: 'Heroes', assets: ['spr_a', 'spr_b'] }],
  smart: [{ id: 'smart_1', name: 'Heroes unsaved', query: 'tag:hero is:unsaved' }],
  pinned: ['spr_a'],
});

const withOrganise = (): ProjectDocument => ({ ...sampleDocument(), organise: organise() });

describe('K2 the organise block', { tags: ['critical'] }, () => {
  it('is written as version 3 after the export settings and read back with sorted tags', () => {
    const output = must(writeProjectDocument(withOrganise()));
    const json = JSON.parse(output) as Record<string, unknown>;
    expect(json['formatVersion']).toBe(3);
    expect(Object.keys(json)).toEqual(['format', 'formatVersion', 'projectId', 'name', 'folders', 'defaults', 'organise', 'assistant']);
    expect(Object.keys(json['organise'] as object)).toEqual(['tags', 'collections', 'smart', 'pinned']);
    expect(Object.keys((json['organise'] as { tags: object }).tags)).toEqual(['spr_a', 'spr_b']);
    const parsed = parseProjectDocument(output);
    expect(parsed.ok && parsed.value.organise?.pinned).toEqual(['spr_a']);
    expect(parsed.ok && parsed.value.organise?.collections[0]?.assets).toEqual(['spr_a', 'spr_b']);
  });

  it('stays version 2 and writes no block when nothing is organised', () => {
    const empty: ProjectOrganise = { tags: {}, collections: [], smart: [], pinned: [] };
    const output = must(writeProjectDocument({ ...sampleDocument(), formatVersion: 3, organise: empty }));
    const json = JSON.parse(output) as Record<string, unknown>;
    expect(json['formatVersion']).toBe(2);
    expect(json['organise']).toBeUndefined();
  });

  it('upgrades a version 2 document when it gains a block, and reads either version as a project document', () => {
    const output = must(writeProjectDocument(withOrganise()));
    const read = readManifest(output);
    expect(read.ok && read.value.version).toBe(2);
    expect(readManifest(must(writeProjectDocument(sampleDocument()))).ok).toBe(true);
  });

  it('fills the missing parts of a block with empty ones', () => {
    const json = JSON.parse(must(writeProjectDocument(withOrganise()))) as Record<string, unknown>;
    json['organise'] = { pinned: ['spr_a'] };
    const parsed = parseProjectDocument(JSON.stringify(json));
    expect(parsed.ok && parsed.value.organise).toEqual({ tags: {}, collections: [], smart: [], pinned: ['spr_a'] });
  });

  const BROKEN: readonly (readonly [string, (json: Record<string, unknown>) => void])[] = [
    ['a block in a version 2 file', (json) => (json['formatVersion'] = 2)],
    ['version 3 without a block', (json) => delete json['organise']],
    ['a repeated collection id', (json) => (json['organise'] = { ...organise(), collections: [...organise().collections, ...organise().collections] })],
    ['a tag twice on one file', (json) => (json['organise'] = { ...organise(), tags: { spr_a: ['Hero', 'hero'] } })],
    ['an unknown key', (json) => (json['organise'] = { ...organise(), colours: [] })],
    ['a tag with a control character', (json) => (json['organise'] = { ...organise(), tags: { spr_a: ['he\nro'] } })],
  ];

  it.each(BROKEN)('refuses %s', (_label, change) => {
    const json = JSON.parse(must(writeProjectDocument(withOrganise()))) as Record<string, unknown>;
    change(json);
    const parsed = parseProjectDocument(JSON.stringify(json));
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) expect(parsed.code).toBe(PROJECT_ERROR_CODE.MANIFEST_INVALID);
  });
});
