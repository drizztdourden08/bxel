/* @layer tests @kind test */
import {
  atLeast,
  checkGrant,
  itemLevel,
  PRESETS,
  toolLevel,
} from '@bxel/mcp';
import type { BundleId, Grant, Level, ToolRowId } from '@bxel/mcp';
import { describe, expect, it } from 'vitest';

const withBundles = (changes: Partial<Record<BundleId, Level>>, base: Grant = PRESETS.full_control.grant): Grant => ({
  ...base,
  bundles: { ...base.bundles, ...changes },
});

const withTools = (tools: Partial<Record<ToolRowId, Level>>, base: Grant = PRESETS.full_control.grant): Grant => ({ ...base, tools });

const steps = (...names: string[]) => ({ documentId: 'doc_1', baseRevision: 1, steps: names.map((name) => ({ name })) });

describe('the effective level of a tool', () => {
  it('follows its bundle unless it has an override', () => {
    const grant = withBundles({ files_saving: 'read' });
    expect(toolLevel(grant, 'save_document')).toBe('read');
    expect(toolLevel(withTools({ save_document: 'edit' }, grant), 'save_document')).toBe('edit');
    expect(toolLevel(withTools({ get_document: 'disabled' }), 'get_document')).toBe('disabled');
  });

  it('lets an override be higher or lower than the bundle', () => {
    const lowered = withTools({ undo: 'read' });
    expect(toolLevel(lowered, 'undo')).toBe('read');
    const raised = withTools({ get_document: 'edit' }, withBundles({ read_documents: 'read' }));
    expect(toolLevel(raised, 'get_document')).toBe('edit');
  });

  it('takes the lower of the tool and the item bundle for a routed call', () => {
    const grant = withBundles({ tilemaps: 'read' });
    expect(itemLevel(grant, 'apply_edits', 'tilemaps')).toBe('read');
    expect(itemLevel(grant, 'apply_edits', 'animation')).toBe('edit');
    expect(itemLevel(withTools({ apply_edits: 'read' }, grant), 'apply_edits', 'animation')).toBe('read');
    expect(itemLevel(withTools({ apply_edits: 'edit' }, withBundles({ animation: 'read' })), 'apply_edits', 'animation')).toBe('read');
  });

  it('orders Disabled below Read below Edit', () => {
    expect(atLeast('edit', 'read')).toBe(true);
    expect(atLeast('read', 'edit')).toBe(false);
    expect(atLeast('disabled', 'read')).toBe(false);
  });
});

describe('checking a call against a grant', () => {
  it('lets a full grant do everything', () => {
    for (const tool of ['save_document', 'stop_bxel', 'close_document'] as const) expect(checkGrant(tool, { discard: true, unsaved: 'discard' }, PRESETS.full_control.grant)).toBeNull();
    expect(checkGrant('apply_edits', steps('map.paint', 'pixels.patch'), PRESETS.full_control.grant)).toBeNull();
  });

  it('refuses a Disabled tool with TOOL_DISABLED naming the program', () => {
    const grant = withTools({ get_document: 'disabled' });
    const refused = checkGrant('get_document', {}, grant, 'Pixel Agent');
    expect(refused?.error.code).toBe('TOOL_DISABLED');
    expect(refused?.error.message).toBe('get_document is turned off for Pixel Agent.');
    expect(refused?.error.retry).toBe('after_owner');
  });

  it('refuses a tool whose bundle is Disabled and a blocked program', () => {
    expect(checkGrant('list_files', {}, withBundles({ browse_files: 'disabled' }))?.error.code).toBe('TOOL_DISABLED');
    expect(checkGrant('get_session', {}, { ...PRESETS.full_control.grant, blocked: true })?.error.code).toBe('TOOL_DISABLED');
  });

  it('refuses a write at Read with READ_LEVEL naming the bundle', () => {
    const grant = withBundles({ files_saving: 'read' });
    const refused = checkGrant('save_document', {}, grant);
    expect(refused?.error.code).toBe('READ_LEVEL');
    expect(refused?.error.message).toContain('save_document needs Edit. Files and saving is set to Read for this program.');
    expect(refused?.error.message).toContain('Settings, Assistant programs');
    expect(refused?.error.retry).toBe('after_owner');
    expect(checkGrant('get_document', {}, grant)).toBeNull();
  });

  it('names the tool, not the bundle, when an override causes the refusal', () => {
    const refused = checkGrant('undo', {}, withTools({ undo: 'read' }));
    expect(refused?.error.message).toContain('undo needs Edit. It is set to Read for this program.');
  });

  it('lets a mixed tool read and refuses its writing inputs at Read', () => {
    const grant = withBundles({ browse_files: 'read', session: 'read' });
    expect(checkGrant('close_document', { documentId: 'doc_1' }, grant)).toBeNull();
    expect(checkGrant('close_document', { documentId: 'doc_1', discard: true }, grant)?.error.code).toBe('READ_LEVEL');
    expect(checkGrant('stop_bxel', { unsaved: 'recover' }, grant)).toBeNull();
    expect(checkGrant('stop_bxel', { unsaved: 'discard' }, grant)?.error.message).toContain('Session is set to Read');
  });

  it('lets a read tool run at Read and at Edit', () => {
    expect(checkGrant('read_pixels', {}, PRESETS.read_only.grant)).toBeNull();
    expect(checkGrant('preview_edits', steps('map.paint'), PRESETS.read_only.grant)).toBeNull();
  });
});

describe('a batch of steps', () => {
  it('refuses the whole batch when one Tilemaps step is at Read, naming the step', () => {
    const grant = withBundles({ tilemaps: 'read' });
    const refused = checkGrant('apply_edits', steps('pixels.patch', 'map.paint', 'layer.add'), grant);
    expect(refused?.error.code).toBe('READ_LEVEL');
    expect(refused?.error.step).toBe(1);
    expect(refused?.error.message).toContain('apply_edits step 2 (map.paint) needs Edit. Tilemaps is set to Read for this program.');
  });

  it('allows the other bundles in the same grant', () => {
    expect(checkGrant('apply_edits', steps('pixels.patch', 'animation.create', 'sheet.create'), withBundles({ tilemaps: 'read' }))).toBeNull();
  });

  it('refuses a Disabled bundle step with TOOL_DISABLED', () => {
    const refused = checkGrant('apply_edits', steps('animation.create'), withBundles({ animation: 'disabled' }), 'Pixel Agent');
    expect(refused?.error.code).toBe('TOOL_DISABLED');
    expect(refused?.error.message).toContain('belongs to Animation, which is turned off for Pixel Agent');
  });

  it('previews a step at Read but not in a Disabled bundle', () => {
    const grant = withBundles({ tilemaps: 'read', animation: 'disabled' });
    expect(checkGrant('preview_edits', steps('map.paint'), grant)).toBeNull();
    expect(checkGrant('preview_edits', steps('animation.create'), grant)?.error.code).toBe('TOOL_DISABLED');
  });

  it('fails closed on a step it cannot place', () => {
    expect(checkGrant('apply_edits', steps('effects.blur'), withBundles({ tilemaps: 'read' }))?.error.code).toBe('READ_LEVEL');
    expect(checkGrant('apply_edits', steps('effects.blur'), PRESETS.full_control.grant)).toBeNull();
  });

  it('caps a routed tool with its own override', () => {
    expect(checkGrant('apply_edits', steps('pixels.patch'), withTools({ apply_edits: 'read' }))?.error.message).toContain('It is set to Read');
    expect(checkGrant('apply_edits', steps('pixels.patch'), withTools({ apply_edits: 'disabled' }))?.error.code).toBe('TOOL_DISABLED');
  });
});
