/* @layer tests @kind test */
import { checkCommand, checkGrant, describeTools, MCP_ERROR_CODE, PRESETS, toolsForGrant } from '@bxel/mcp';
import type { BundleId, Grant, Level } from '@bxel/mcp';
import { documentCommands } from '@bxel/document';
import { describe, expect, it } from 'vitest';

const withBundles = (changes: Partial<Record<BundleId, Level>>, base: Grant = PRESETS.full_control.grant): Grant => ({
  ...base,
  bundles: { ...base.bundles, ...changes },
});

const item = (area: BundleId, changes: boolean) => ({ what: 'run_command thing', area, changes });

describe('run_command and set_view grants', () => {
  it('runs a show command at Read and refuses an editing one, naming the bundle', () => {
    const grant = PRESETS.edit_documents.grant;
    expect(checkCommand(grant, 'run_command', item('app_control', false))).toBeNull();
    const refused = checkCommand(grant, 'run_command', item('app_control', true));
    expect(refused?.error.code).toBe(MCP_ERROR_CODE.READ_LEVEL);
    expect(refused?.error.message).toContain('App control is set to Read');
  });

  it('takes the lower of the tool level and the bundle of the command', () => {
    const grant = withBundles({ animation: 'read' });
    expect(checkCommand(grant, 'run_command', item('edit_pixels', true))).toBeNull();
    expect(checkCommand(grant, 'run_command', item('animation', true))?.error.code).toBe(MCP_ERROR_CODE.READ_LEVEL);
    expect(checkCommand(grant, 'run_command', item('animation', false))).toBeNull();
  });

  it('refuses a command of a Disabled bundle as turned off', () => {
    const grant = withBundles({ tilemaps: 'disabled' });
    expect(checkCommand(grant, 'run_command', item('tilemaps', false))?.error.code).toBe(MCP_ERROR_CODE.TOOL_DISABLED);
  });

  it('lets main pass run_command at Read and refuses set_view state fields there', () => {
    const grant = PRESETS.edit_documents.grant;
    expect(checkGrant('run_command', { id: 'view.zoom_in' }, grant)).toBeNull();
    expect(checkGrant('set_view', { zoom: 'fit' }, grant)).toBeNull();
    expect(checkGrant('set_view', { tool: { id: 'pencil' } }, grant)?.error.code).toBe(MCP_ERROR_CODE.READ_LEVEL);
    expect(checkGrant('set_view', { selection: { shape: { kind: 'all' } } }, PRESETS.full_control.grant)).toBeNull();
  });

  it('notes the Read level on run_command and hides the tools of a Disabled App control', () => {
    const descriptors = describeTools(documentCommands);
    const note = toolsForGrant(descriptors, PRESETS.edit_documents.grant).find((tool) => tool.name === 'run_command')?.description ?? '';
    expect(note).toMatch(/only commands that change what is shown run/);
    const names = toolsForGrant(descriptors, withBundles({ app_control: 'disabled' })).map((tool) => tool.name);
    for (const gone of ['list_commands', 'run_command', 'get_view', 'set_view']) expect(names).not.toContain(gone);
    expect(names).toContain('get_history');
  });
});

describe('the restart permission', () => {
  it('hides restart_bxel and refuses it by name until the owner allows it', () => {
    const descriptors = describeTools(documentCommands);
    const namesOf = (grant: Grant): string[] => toolsForGrant(descriptors, grant).map((tool) => tool.name);
    expect(namesOf(PRESETS.full_control.grant)).not.toContain('restart_bxel');
    expect(checkGrant('restart_bxel', {}, PRESETS.full_control.grant, 'Sample Agent')?.error.message).toContain('May restart Bxel');
    const allowed: Grant = { ...PRESETS.full_control.grant, special: { mayRestart: true } };
    expect(namesOf(allowed)).toContain('restart_bxel');
    expect(checkGrant('restart_bxel', {}, allowed)).toBeNull();
  });

  it('needs Edit on the Session bundle even with the permission', () => {
    const allowed: Grant = { ...withBundles({ session: 'read' }), special: { mayRestart: true } };
    expect(checkGrant('restart_bxel', {}, allowed)?.error.code).toBe(MCP_ERROR_CODE.READ_LEVEL);
  });

  it('lets the settings write tool through for Full control and not for Edit documents', () => {
    expect(checkGrant('set_setting', { scope: 'app', key: 'theme', value: 'dark' }, PRESETS.edit_documents.grant)?.error.code).toBe(MCP_ERROR_CODE.READ_LEVEL);
    expect(checkGrant('set_setting', { scope: 'app', key: 'theme', value: 'dark' }, PRESETS.full_control.grant)).toBeNull();
  });
});
