/* @layer tests @kind test */
import { grantOfMode, PRESETS } from '@bxel/mcp';
import type { Grant } from '@bxel/mcp';
import { describe, expect, it } from 'vitest';
import { assistantMain } from '../../electron/assistant/assistant-main';
import type { LiveSession } from '../../electron/assistant/assistant.type';
import { createSessionTable } from '../../electron/assistant/create-session-table';
import { instanceView } from '../../electron/assistant/instance-view';
import { syncGrants } from '../../electron/assistant/sync-grants';

const sessionOf = (grant: Grant, extra: Partial<LiveSession> = {}): LiveSession => ({
  token: 't'.repeat(64),
  sessionId: 's1',
  connectionId: 'c1',
  launchedThis: false,
  granted: grant,
  grant,
  mode: 'edit',
  programKey: 'pixel agent',
  trust: 'remembered',
  client: { name: 'Pixel Agent', version: null },
  displayName: 'Pixel Agent',
  connectedAt: 1,
  lastCallAt: 1,
  ...extra,
});

const tableWith = (session: LiveSession) => {
  const pushed: LiveSession[] = [];
  const table = createSessionTable(() => undefined, (live) => pushed.push(live));
  table.add(session);
  return { table, pushed };
};

describe('changing the grant of a live session', () => {
  it('replaces the grant, derives the mode and pushes it to the helper', () => {
    const { table, pushed } = tableWith(sessionOf(PRESETS.full_control.grant));
    expect(table.setGrant('s1', PRESETS.read_only.grant, true)).toBe(true);
    expect(pushed).toHaveLength(1);
    expect(table.views()[0]).toMatchObject({ mode: 'read', grant: PRESETS.read_only.grant });
  });

  it('keeps the stored grant when the owner only narrows this session', () => {
    const { table } = tableWith(sessionOf(PRESETS.full_control.grant));
    table.setMode('s1', 'read');
    expect(table.list()[0]).toMatchObject({ mode: 'read', grant: PRESETS.read_only.grant, granted: PRESETS.full_control.grant });
    table.setMode('s1', 'edit');
    expect(table.list()[0]).toMatchObject({ mode: 'edit', grant: PRESETS.full_control.grant });
  });

  it('gives a read program an editing preset when the owner allows editing', () => {
    const { table } = tableWith(sessionOf(PRESETS.read_only.grant, { mode: 'read' }));
    table.setMode('s1', 'edit');
    expect(table.list()[0]?.mode).toBe('edit');
  });

  it('knows no other session', () => {
    const { table, pushed } = tableWith(sessionOf(PRESETS.read_only.grant));
    expect(table.setGrant('s9', PRESETS.full_control.grant, true)).toBe(false);
    expect(pushed).toEqual([]);
  });
});

describe('following the stored grants', () => {
  const stateWith = (session: LiveSession) => {
    const pushed: LiveSession[] = [];
    const sessions = createSessionTable(() => undefined, (live) => pushed.push(live));
    sessions.add(session);
    return { state: { ...assistantMain, sessions, synced: new Map<string, string>() }, pushed };
  };

  it('pushes a changed grant to the live sessions of that program only once', () => {
    const { state, pushed } = stateWith(sessionOf(PRESETS.full_control.grant));
    const narrowed = { ...PRESETS.full_control.grant, bundles: { ...PRESETS.full_control.grant.bundles, files_saving: 'read' } };
    syncGrants(state, [{ key: 'pixel agent', grant: narrowed }]);
    syncGrants(state, [{ key: 'pixel agent', grant: narrowed }]);
    expect(pushed).toHaveLength(1);
    expect(state.sessions.list()[0]?.grant.bundles.files_saving).toBe('read');
  });

  it('leaves other programs, launch approvals and bad grants alone', () => {
    const { state, pushed } = stateWith(sessionOf(PRESETS.full_control.grant, { trust: 'this_launch' }));
    syncGrants(state, [{ key: 'pixel agent', grant: PRESETS.read_only.grant }]);
    syncGrants(state, [{ key: 'other', grant: PRESETS.read_only.grant }, { key: 'pixel agent', grant: { v: 9 } }]);
    expect(pushed).toEqual([]);
  });

  it('does not undo a session narrowed with the chip until the stored grant itself changes', () => {
    const grant = grantOfMode('edit');
    const { state } = stateWith(sessionOf(grant));
    state.synced.set('pixel agent', JSON.stringify(grant));
    state.sessions.setMode('s1', 'read');
    syncGrants(state, [{ key: 'pixel agent', grant }]);
    expect(state.sessions.list()[0]?.mode).toBe('read');
    syncGrants(state, [{ key: 'pixel agent', grant: PRESETS.edit_documents.grant }]);
    expect(state.sessions.list()[0]?.grant).toEqual(PRESETS.edit_documents.grant);
  });
});

describe('who may stop Bxel', () => {
  const state = { ...assistantMain, instance: { window: 'visible' as const, started: false, launchToken: null } };

  it('refuses an owner launched Bxel unless the program may restart it', () => {
    expect(instanceView(state, sessionOf(PRESETS.full_control.grant)).canStop).toBe(false);
    const special = { ...PRESETS.full_control.grant, special: { mayRestart: true } };
    expect(instanceView(state, sessionOf(special)).canStop).toBe(true);
  });

  it('still lets the session that started a headless Bxel stop it', () => {
    const headless = { ...state, instance: { window: 'headless' as const, started: true, launchToken: 'x' } };
    expect(instanceView(headless, sessionOf(PRESETS.read_only.grant, { launchedThis: true })).canStop).toBe(true);
  });
});
