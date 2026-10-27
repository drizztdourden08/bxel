/* @layer tests @kind test */
import { decideTrust, DEFAULT_TRUST_STORE, grantOfMode, modeOfGrant, programKey } from '@bxel/mcp';
import type { HelloClient, LaunchApproval, ProgramMode, TrustEntry, TrustLevel, TrustStore } from '@bxel/mcp';
import { describe, expect, it } from 'vitest';

const client = (name: string | null): HelloClient => ({ name, version: '1.0' });

const entry = (key: string, mode: ProgramMode): TrustEntry => ({
  key,
  displayName: key,
  mode,
  grant: grantOfMode(mode),
  firstApproved: '2026-10-01T00:00:00Z',
  lastConnected: '2026-10-02T00:00:00Z',
  lastVersion: '1.0',
});

const storeAt = (level: TrustLevel, programs: TrustEntry[] = []): TrustStore => ({
  ...DEFAULT_TRUST_STORE,
  level,
  programs,
});

const launch: LaunchApproval[] = [{ key: 'pixel-agent', grant: grantOfMode('edit') }];

describe('program keys', () => {
  it('trims, lowercases and collapses inner spaces', () => {
    expect(programKey('  Pixel   Agent ')).toBe('pixel agent');
    expect(programKey('pixel-agent')).toBe('pixel-agent');
    expect(programKey('Pixel\t\nAgent')).toBe('pixel agent');
  });

  it('accepts 1 to 64 characters', () => {
    expect(programKey('a')).toBe('a');
    expect(programKey('a'.repeat(64))).toBe('a'.repeat(64));
    expect(programKey('a'.repeat(65))).toBeNull();
  });

  it('treats a missing, empty or control character name as unnamed', () => {
    for (const name of [null, undefined, '', '   ', 'bad\u0000name']) expect(programKey(name)).toBeNull();
  });
});

describe('level: ask for every connection', () => {
  const store = storeAt('ask_every', [entry('pixel-agent', 'edit')]);

  it('asks even for a remembered program and remembers nothing', () => {
    expect(decideTrust(client('Pixel-Agent'), store, launch)).toEqual({ kind: 'ask', remember: 'none' });
  });

  it('ignores a blocked entry', () => {
    const blocked = storeAt('ask_every', [entry('pixel-agent', 'blocked')]);
    expect(decideTrust(client('pixel-agent'), blocked)).toEqual({ kind: 'ask', remember: 'none' });
  });
});

describe('level: ask once until Bxel quits', () => {
  const store = storeAt('ask_once_session', [entry('pixel-agent', 'edit')]);

  it('asks the first time and offers to remember for this launch', () => {
    expect(decideTrust(client('pixel-agent'), store, [])).toEqual({ kind: 'ask', remember: 'launch' });
  });

  it('pairs with the approved mode afterwards, ignoring the saved list', () => {
    expect(decideTrust(client('Pixel-Agent'), store, [{ key: 'pixel-agent', grant: grantOfMode('read') }])).toEqual({
      kind: 'pair',
      grant: grantOfMode('read'),
      mode: 'read',
      trust: 'this_launch',
    });
  });

  it('asks every time for an unnamed program', () => {
    expect(decideTrust(client(null), store, launch)).toEqual({ kind: 'ask', remember: 'none' });
  });
});

describe('level: ask once and remember (default)', () => {
  it('is the default level', () => {
    expect(DEFAULT_TRUST_STORE.level).toBe('ask_once_remember');
    expect(DEFAULT_TRUST_STORE.allowAllMode).toBe('read');
  });

  it('asks for a new program and offers to save the choice', () => {
    expect(decideTrust(client('pixel-agent'), DEFAULT_TRUST_STORE)).toEqual({ kind: 'ask', remember: 'saved' });
  });

  it('pairs a remembered program with its mode', () => {
    for (const mode of ['read', 'edit'] as const) {
      const store = storeAt('ask_once_remember', [entry('pixel-agent', mode)]);
      expect(decideTrust(client('  PIXEL-AGENT'), store)).toEqual({ kind: 'pair', grant: grantOfMode(mode), mode, trust: 'remembered' });
    }
  });

  it('denies a program remembered as blocked', () => {
    const store = storeAt('ask_once_remember', [entry('pixel-agent', 'blocked')]);
    expect(decideTrust(client('pixel-agent'), store)).toEqual({ kind: 'deny' });
  });

  it('never remembers or pairs an unnamed program', () => {
    const store = storeAt('ask_once_remember', [entry('pixel-agent', 'edit')]);
    expect(decideTrust(client(null), store)).toEqual({ kind: 'ask', remember: 'none' });
  });

  it('ignores approvals from this launch', () => {
    expect(decideTrust(client('pixel-agent'), DEFAULT_TRUST_STORE, launch)).toEqual({ kind: 'ask', remember: 'saved' });
  });
});

describe('level: allow all', () => {
  it('pairs any program with the allow all mode, read only by default', () => {
    const store = storeAt('allow_all');
    const grant = grantOfMode('read');
    expect(decideTrust(client('whatever'), store)).toEqual({ kind: 'pair', grant, mode: 'read', trust: 'allow_all' });
    expect(decideTrust(client(null), store)).toEqual({ kind: 'pair', grant, mode: 'read', trust: 'allow_all' });
  });

  it('uses the mode set beside the option', () => {
    const store: TrustStore = { ...storeAt('allow_all'), allowAllMode: 'edit' };
    expect(decideTrust(client('whatever'), store)).toEqual({ kind: 'pair', grant: grantOfMode('edit'), mode: 'edit', trust: 'allow_all' });
    expect(modeOfGrant(grantOfMode('edit'))).toBe('edit');
  });

  it('still blocks a program remembered as blocked', () => {
    const store = storeAt('allow_all', [entry('pixel-agent', 'blocked')]);
    expect(decideTrust(client('Pixel-Agent'), store)).toEqual({ kind: 'deny' });
    expect(decideTrust(client('other'), store).kind).toBe('pair');
  });
});
