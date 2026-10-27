/* @layer tests @kind test */
import { BUNDLE_IDS, checkGrant, makeGrant, PRESETS, TOOL_CATALOGUE } from '@bxel/mcp';
import type { Grant, ToolName } from '@bxel/mcp';
import { describe, expect, it } from 'vitest';
import { TOOL_TEXT } from '../../src/views/AssistantPanel/ProgramGrant.constants';
import { bundleRows } from '../../src/views/AssistantPanel/behavior/bundle-rows';
import { presetGrant } from '../../src/views/AssistantPanel/behavior/preset-grant';
import { presetOf } from '../../src/views/AssistantPanel/behavior/preset-of';
import { withBundleLevel } from '../../src/views/AssistantPanel/behavior/with-bundle-level';
import { withMayRestart } from '../../src/views/AssistantPanel/behavior/with-may-restart';
import { withToolLevel } from '../../src/views/AssistantPanel/behavior/with-tool-level';

const full: Grant = PRESETS.full_control.grant;

const toolIds = (grant: Grant, query: string): ToolName[] => bundleRows(grant, query).flatMap((each) => each.tools.map((one) => one.id));

const row = (grant: Grant, id: string, query = '') => bundleRows(grant, query).find((each) => each.id === id);

const tool = (grant: Grant, id: ToolName) => {
  const found = bundleRows(grant, '').flatMap((each) => each.tools).find((each) => each.id === id);
  if (!found) throw new Error(`no row for ${id}`);
  return found;
};

describe('the permissions rows list the whole catalogue', () => {
  it('shows every bundle and every tool once, each with a description', () => {
    const rows = bundleRows(full, '');
    expect(rows.map((each) => each.id)).toEqual([...BUNDLE_IDS]);
    const tools = toolIds(full, '').sort();
    expect(tools).toEqual((Object.keys(TOOL_CATALOGUE) as ToolName[]).sort());
    for (const one of Object.keys(TOOL_CATALOGUE)) expect(TOOL_TEXT[one as ToolName], one).not.toBe('');
  });

  it('names each control for the bundle or the tool, and says when a tool overrides its bundle', () => {
    expect(row(full, 'edit_pixels')?.name).toBe('Edit pixels permission');
    expect(tool(full, 'save_document').name).toBe('save_document permission');
    expect(tool(withToolLevel(full, 'save_document', 'disabled'), 'save_document').name).toBe('save_document permission, overrides Files and saving');
  });
});

describe('levels', () => {
  it('offers Disabled, Read and Edit in that order, and greys what a tool cannot use with a reason', () => {
    const reads = tool(full, 'get_document').options;
    expect(reads.map((option) => option.value)).toEqual(['disabled', 'read', 'edit']);
    expect(reads.find((option) => option.value === 'edit')?.disabled).toBe('This tool only reads.');
    expect(tool(full, 'save_document').options.find((option) => option.value === 'read')?.disabled).toBe('This tool only writes.');
    expect(tool(full, 'close_document').options.every((option) => option.disabled === undefined)).toBe(true);
    expect(row(full, 'read_documents')?.options.find((option) => option.value === 'edit')?.disabled).toBe('This group only reads.');
    expect(row(full, 'edit_pixels')?.options.every((option) => option.disabled === undefined)).toBe(true);
  });

  it('shows a read only tool at Read when its bundle is at Edit', () => {
    expect(tool(full, 'list_files').level).toBe('read');
    expect(tool(full, 'close_document').level).toBe('edit');
  });
});

describe('overrides', () => {
  it('a bundle change keeps the overrides of its tools', () => {
    const overridden = withToolLevel(full, 'save_document', 'disabled');
    const moved = withBundleLevel(overridden, 'files_saving', 'read');
    expect(moved.tools).toEqual({ save_document: 'disabled' });
    expect(row(moved, 'files_saving')?.overrides).toBe(1);
    expect(tool(moved, 'save_document').level).toBe('disabled');
  });

  it('a tool override wins over its bundle in the real check', () => {
    const grant = withToolLevel(withBundleLevel(full, 'files_saving', 'read'), 'create_document', 'edit');
    expect(checkGrant('create_document', { kind: 'sprite' }, grant)).toBeNull();
    expect(checkGrant('save_document', { documentId: 'x' }, grant)?.error.code).toBe('READ_LEVEL');
    const off = withToolLevel(full, 'save_document', 'disabled');
    expect(checkGrant('save_document', { documentId: 'x' }, off)?.error.code).toBe('TOOL_DISABLED');
  });

  it('setting a tool to what its bundle gives clears the override', () => {
    const overridden = withToolLevel(full, 'save_document', 'disabled');
    expect(overridden.tools).toEqual({ save_document: 'disabled' });
    expect(withToolLevel(overridden, 'save_document', 'edit').tools).toEqual({});
    expect(withToolLevel(full, 'get_document', 'read').tools).toEqual({});
    expect(withToolLevel(full, 'get_document', 'edit').tools).toEqual({});
  });

  it('counts the overrides of a bundle', () => {
    const grant = withToolLevel(withToolLevel(full, 'save_document', 'disabled'), 'export_document', 'disabled');
    expect(row(grant, 'files_saving')?.overrides).toBe(2);
    expect(row(grant, 'session')?.overrides).toBe(0);
  });
});

describe('bundle levels reach the enforcement', () => {
  it('Disabled hides the tools of a bundle from the helper listing and Read refuses writes', () => {
    const disabled = withBundleLevel(full, 'files_saving', 'disabled');
    expect(checkGrant('save_document', { documentId: 'x' }, disabled)?.error.code).toBe('TOOL_DISABLED');
    const read = withBundleLevel(full, 'files_saving', 'read');
    expect(checkGrant('save_document', { documentId: 'x' }, read)?.error.code).toBe('READ_LEVEL');
    expect(checkGrant('get_document', { documentId: 'x' }, read)).toBeNull();
  });
});

describe('presets', () => {
  it('recognise their own grants and call anything else Custom', () => {
    expect(presetOf(PRESETS.read_only.grant)).toBe('read_only');
    expect(presetOf(PRESETS.edit_documents.grant)).toBe('edit_documents');
    expect(presetOf(full)).toBe('full_control');
    expect(presetOf(withBundleLevel(full, 'animation', 'read'))).toBe('custom');
    expect(presetOf(withToolLevel(full, 'save_document', 'disabled'))).toBe('custom');
    expect(presetOf(makeGrant('disabled'))).toBe('custom');
  });

  it('set the expected levels and switch the special permission off', () => {
    const edit = presetGrant('edit_documents');
    expect(edit?.bundles).toMatchObject({ edit_pixels: 'edit', files_saving: 'edit', app_control: 'read', layout: 'read', settings: 'read' });
    const reset = presetGrant('full_control');
    expect(reset?.special.mayRestart).toBe(false);
    expect(reset?.tools).toEqual({});
    expect(presetGrant('read_only')?.bundles.edit_pixels).toBe('read');
    expect(presetGrant('blocked')?.blocked).toBe(true);
    expect(presetOf(presetGrant('blocked') ?? full)).toBe('blocked');
    expect(presetGrant('custom')).toBeNull();
  });

  it('keep the special permission off by default and let the toggle change it', () => {
    for (const grant of Object.values(PRESETS).map((entry) => entry.grant)) expect(grant.special.mayRestart).toBe(false);
    expect(withMayRestart(full, true).special.mayRestart).toBe(true);
    expect(withMayRestart(withMayRestart(full, true), false).special.mayRestart).toBe(false);
    expect(presetOf(withMayRestart(full, true))).toBe('full_control');
  });
});

describe('search', () => {
  it('keeps the bundles and tools that match and leaves the others out', () => {
    const rows = bundleRows(full, 'save_document');
    expect(rows.map((each) => each.id)).toEqual(['files_saving']);
    expect(rows[0]?.tools.map((each) => each.id)).toEqual(['save_document']);
  });

  it('shows all tools of a bundle whose own name matches', () => {
    expect(row(full, 'files_saving', 'files and')?.tools).toHaveLength(4);
  });

  it('matches on the tool description and on several words, and finds nothing for nonsense', () => {
    expect(toolIds(full, 'older file')).toEqual(['split_legacy_file']);
    expect(bundleRows(full, 'zzzz')).toEqual([]);
  });
});
