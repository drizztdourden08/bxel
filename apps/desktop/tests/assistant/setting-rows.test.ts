/* @layer tests @kind test */
import { checkGrant, PRESETS, readGrant, SETTING_ROWS } from '@bxel/mcp';
import type { Grant } from '@bxel/mcp';
import { describe, expect, it } from 'vitest';
import { bundleRows } from '../../src/views/AssistantPanel/behavior/bundle-rows';
import { withToolLevel } from '../../src/views/AssistantPanel/behavior/with-tool-level';

const full: Grant = PRESETS.full_control.grant;

const settingsRows = (grant: Grant) => bundleRows(grant, '').find((each) => each.id === 'settings')?.tools ?? [];

const set = (grant: Grant, scope: string) => checkGrant('set_setting', { scope, key: 'x', value: 1 }, grant);

describe('K1 the Settings group on the permissions page', { tags: ['critical'] }, () => {
  it('shows get_settings and one set_setting row for each scope', () => {
    expect(settingsRows(full).map((each) => each.id)).toEqual(['get_settings', 'set_setting:app', 'set_setting:project', 'set_setting:asset']);
    expect(Object.values(SETTING_ROWS)).toEqual(['set_setting:app', 'set_setting:project', 'set_setting:asset']);
    for (const each of settingsRows(full)) expect(each.description).not.toBe('');
  });

  it('turns one scope off and leaves the others to the group', () => {
    const grant = withToolLevel(full, 'set_setting:project', 'disabled');
    expect(set(grant, 'project')?.error.code).toBe('TOOL_DISABLED');
    expect(set(grant, 'app')).toBeNull();
    expect(set(grant, 'asset')).toBeNull();
    expect(settingsRows(grant).find((each) => each.id === 'set_setting:project')).toMatchObject({ level: 'disabled', overridden: true });
  });

  it('can open one scope while the group is at Read', () => {
    const read = { ...full, bundles: { ...full.bundles, settings: 'read' as const } };
    expect(set(read, 'app')?.error.code).toBe('READ_LEVEL');
    expect(set(withToolLevel(read, 'set_setting:app', 'edit'), 'app')).toBeNull();
    expect(set(withToolLevel(read, 'set_setting:app', 'edit'), 'asset')?.error.code).toBe('READ_LEVEL');
  });

  it('names the scope row in the refusal', () => {
    const grant = withToolLevel(full, 'set_setting:asset', 'disabled');
    expect(set(grant, 'asset')?.error.message).toContain('set_setting:asset');
  });

  it('counts a scope override on the group', () => {
    const grant = withToolLevel(full, 'set_setting:app', 'disabled');
    expect(bundleRows(grant, '').find((each) => each.id === 'settings')?.overrides).toBe(1);
  });

  it('reads a stored grant that still holds the old single set_setting override into the three scope rows', () => {
    const stored = { v: 1, blocked: false, bundles: full.bundles, tools: { set_setting: 'disabled' }, special: { mayRestart: false } };
    const grant = readGrant(stored);
    expect(grant?.tools).toEqual({ 'set_setting:app': 'disabled', 'set_setting:project': 'disabled', 'set_setting:asset': 'disabled' });
    expect(set(grant ?? full, 'app')?.error.code).toBe('TOOL_DISABLED');
  });
});
