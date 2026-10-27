/* @layer tests @kind test */
import {
  buildTools,
  describeTools,
  grantOfMode,
  makeGrant,
  modeOfGrant,
  PRESETS,
  readGrant,
  toolsForGrant,
} from '@bxel/mcp';
import type { BundleId, Grant, Level, ToolRowId } from '@bxel/mcp';
import { documentCommands } from '@bxel/document';
import { describe, expect, it } from 'vitest';

const withBundles = (changes: Partial<Record<BundleId, Level>>, base: Grant = PRESETS.full_control.grant): Grant => ({
  ...base,
  bundles: { ...base.bundles, ...changes },
});

const withTools = (tools: Partial<Record<ToolRowId, Level>>, base: Grant = PRESETS.full_control.grant): Grant => ({ ...base, tools });

describe('the tool list a program sees', () => {
  const descriptors = describeTools(documentCommands);
  const namesFor = (grant: Grant): string[] => toolsForGrant(descriptors, grant).map((tool) => tool.name);

  it('lists every tool for a full grant, without notes', () => {
    expect(namesFor(PRESETS.full_control.grant)).toHaveLength(buildTools(documentCommands).length);
    const listed = toolsForGrant(descriptors, PRESETS.full_control.grant);
    expect(listed.map((tool) => tool.description)).toEqual(descriptors.map((tool) => tool.description));
  });

  it('leaves out a Disabled tool and every tool of a Disabled bundle', () => {
    expect(namesFor(withTools({ get_document: 'disabled' }))).not.toContain('get_document');
    const names = namesFor(withBundles({ files_saving: 'disabled' }));
    for (const gone of ['save_document', 'export_document', 'create_document', 'split_legacy_file']) expect(names).not.toContain(gone);
    expect(names).toContain('apply_edits');
  });

  it('hides a step tool only when every step group is Disabled', () => {
    expect(namesFor(withBundles({ tilemaps: 'disabled' }))).toContain('apply_edits');
    const all = withBundles({ edit_pixels: 'disabled', animation: 'disabled', sheets_sprites: 'disabled', tilemaps: 'disabled' });
    expect(namesFor(all)).not.toContain('apply_edits');
    expect(namesFor(all)).not.toContain('preview_edits');
  });

  it('adds a Read level note to a mixed tool and to a write only tool', () => {
    const listed = toolsForGrant(descriptors, PRESETS.read_only.grant);
    const byName = (name: string) => listed.find((tool) => tool.name === name)?.description ?? '';
    expect(byName('close_document')).toMatch(/Read level: writes are refused\.$/);
    expect(byName('stop_bxel')).toMatch(/Read level: writes are refused\.$/);
    expect(byName('save_document')).toMatch(/this tool only writes/);
    expect(byName('get_document')).not.toMatch(/Read level/);
  });

  it('names the limited step groups in the step tool description', () => {
    const listed = toolsForGrant(descriptors, withBundles({ tilemaps: 'read', animation: 'disabled' }));
    const apply = listed.find((tool) => tool.name === 'apply_edits')?.description ?? '';
    expect(apply).toContain('Step groups limited for this program: Animation (Disabled), Tilemaps (Read).');
  });

  it('lists nothing for a blocked program', () => {
    expect(namesFor({ ...PRESETS.full_control.grant, blocked: true })).toEqual([]);
  });
});

describe('the mode derived from a grant', () => {
  it('is edit when a document bundle can write and read otherwise', () => {
    expect(modeOfGrant(PRESETS.read_only.grant)).toBe('read');
    expect(modeOfGrant(PRESETS.edit_documents.grant)).toBe('edit');
    expect(modeOfGrant(PRESETS.full_control.grant)).toBe('edit');
    expect(modeOfGrant({ ...PRESETS.full_control.grant, blocked: true })).toBe('blocked');
  });

  it('is read when only layout or settings can change', () => {
    const grant = makeGrant('read', { layout: 'edit', settings: 'edit', app_control: 'edit' });
    expect(modeOfGrant(grant)).toBe('read');
  });

  it('is edit when one write tool is raised above its Read bundle', () => {
    expect(modeOfGrant({ ...PRESETS.read_only.grant, tools: { save_document: 'edit' } })).toBe('edit');
    expect(modeOfGrant({ ...PRESETS.full_control.grant, tools: { apply_edits: 'read', undo: 'read', save_document: 'read', export_document: 'read', create_document: 'read', split_legacy_file: 'read' } })).toBe('read');
  });
});

describe('reading a stored grant', () => {
  it('accepts a good grant unchanged', () => {
    expect(readGrant(PRESETS.edit_documents.grant)).toEqual(PRESETS.edit_documents.grant);
  });

  it('rejects junk and a future version', () => {
    for (const raw of [undefined, null, 5, 'edit', {}, { v: 2, blocked: false }]) expect(readGrant(raw)).toBeNull();
  });

  it('keeps known levels, reads a missing or bad bundle as Read and drops unknown ones', () => {
    const grant = readGrant({
      v: 1,
      blocked: 'yes',
      bundles: { edit_pixels: 'edit', animation: 'root', future_bundle: 'edit' },
      tools: { undo: 'disabled', get_document: 'nope', not_a_tool: 'edit' },
      special: { mayRestart: 'yes' },
    });
    expect(grant?.blocked).toBe(false);
    expect(grant?.bundles.edit_pixels).toBe('edit');
    expect(grant?.bundles.animation).toBe('read');
    expect(grant?.bundles.tilemaps).toBe('read');
    expect(Object.keys(grant?.bundles ?? {})).not.toContain('future_bundle');
    expect(grant?.tools).toEqual({ undo: 'disabled' });
    expect(grant?.special.mayRestart).toBe(false);
  });

  it('turns the restart permission on only for a true value', () => {
    expect(readGrant({ ...PRESETS.read_only.grant, special: { mayRestart: true } })?.special.mayRestart).toBe(true);
    expect(grantOfMode('edit').special.mayRestart).toBe(false);
  });
});
