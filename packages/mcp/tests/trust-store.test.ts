/* @layer tests @kind test */
import {
  applyAnswer,
  DEFAULT_TRUST_STORE,
  forgetAllPrograms,
  forgetProgram,
  normalizeTrustStore,
  REMEMBERED_PROGRAMS_MAX,
  rememberProgram,
  setProgramMode,
  touchProgram,
} from '@bxel/mcp';
import type { TrustState, TrustStore } from '@bxel/mcp';
import { describe, expect, it } from 'vitest';

const at = (offset: number): string => new Date(Date.UTC(2026, 9, 23, 10, 0, offset)).toISOString();

const named = (name: string, version: string | null = '1.0') => ({ name, version });

const filled = (count: number): TrustStore =>
  Array.from({ length: count }).reduce<TrustStore>(
    (store, _unused, index) => rememberProgram(store, named(`program-${index}`), 'read', at(index)),
    DEFAULT_TRUST_STORE,
  );

describe('remembering programs', () => {
  it('stores the normalized key, the shown name, the mode and the times', () => {
    const store = rememberProgram(DEFAULT_TRUST_STORE, named('  Pixel   Agent '), 'edit', at(1));
    expect(store.programs).toEqual([
      { key: 'pixel agent', displayName: 'Pixel   Agent', mode: 'edit', firstApproved: at(1), lastConnected: at(1), lastVersion: '1.0' },
    ]);
  });

  it('keeps the first approval time when the mode changes', () => {
    const first = rememberProgram(DEFAULT_TRUST_STORE, named('pixel-agent'), 'read', at(1));
    const second = rememberProgram(first, named('Pixel-Agent', '2.0'), 'edit', at(5));
    expect(second.programs).toHaveLength(1);
    expect(second.programs[0]).toMatchObject({ mode: 'edit', firstApproved: at(1), lastConnected: at(5), lastVersion: '2.0' });
  });

  it('never remembers an unnamed program', () => {
    const store = rememberProgram(DEFAULT_TRUST_STORE, { name: null, version: null }, 'edit', at(1));
    expect(store).toBe(DEFAULT_TRUST_STORE);
  });

  it('caps the list at 64 and drops the least recently connected', () => {
    expect(REMEMBERED_PROGRAMS_MAX).toBe(64);
    const full = filled(64);
    expect(full.programs).toHaveLength(64);
    const touched = touchProgram(full, named('program-0'), at(59));
    const grown = rememberProgram(touched, named('newcomer'), 'read', at(59));
    const keys = grown.programs.map((program) => program.key);
    expect(keys).toHaveLength(64);
    expect(keys).toContain('newcomer');
    expect(keys).toContain('program-0');
    expect(keys).not.toContain('program-1');
  });

  it('records a later connection without changing the mode', () => {
    const store = rememberProgram(DEFAULT_TRUST_STORE, named('pixel-agent'), 'edit', at(1));
    const later = touchProgram(store, named('Pixel-Agent', '3.0'), at(9));
    expect(later.programs[0]).toMatchObject({ mode: 'edit', lastConnected: at(9), lastVersion: '3.0', firstApproved: at(1) });
  });
});

describe('changing and forgetting', () => {
  const store = filled(3);

  it('changes the mode of one program', () => {
    const changed = setProgramMode(store, 'program-1', 'blocked');
    expect(changed.programs.find((program) => program.key === 'program-1')?.mode).toBe('blocked');
    expect(changed.programs.find((program) => program.key === 'program-0')?.mode).toBe('read');
  });

  it('forgets one program', () => {
    expect(forgetProgram(store, 'program-1').programs.map((program) => program.key).sort()).toEqual(['program-0', 'program-2']);
  });

  it('forgets all programs and keeps the level', () => {
    const level = { ...store, level: 'allow_all' as const };
    expect(forgetAllPrograms(level)).toEqual({ ...level, programs: [] });
  });

  it('keeps the list when the level changes, so changing back uses it again', () => {
    const lowered = { ...store, level: 'ask_every' as const };
    const raised = { ...lowered, level: 'ask_once_remember' as const };
    expect(raised.programs).toEqual(store.programs);
  });
});

describe('recording the owner answer', () => {
  const start = (level: TrustStore['level']): TrustState => ({ store: { ...DEFAULT_TRUST_STORE, level }, launch: [] });

  it('saves the choice at the remember level', () => {
    const next = applyAnswer(start('ask_once_remember'), named('pixel-agent'), { mode: 'edit', remember: true }, at(1));
    expect(next.store.programs[0]).toMatchObject({ key: 'pixel-agent', mode: 'edit' });
    expect(next.launch).toEqual([]);
  });

  it('saves a Deny as blocked', () => {
    const next = applyAnswer(start('ask_once_remember'), named('pixel-agent'), { mode: 'blocked', remember: true }, at(1));
    expect(next.store.programs[0]?.mode).toBe('blocked');
  });

  it('saves nothing when the owner unticks Remember', () => {
    const state = start('ask_once_remember');
    expect(applyAnswer(state, named('pixel-agent'), { mode: 'edit', remember: false }, at(1))).toBe(state);
  });

  it('keeps the approval in memory only at the until-quit level', () => {
    const next = applyAnswer(start('ask_once_session'), named('Pixel-Agent'), { mode: 'read', remember: true }, at(1));
    expect(next.launch).toEqual([{ key: 'pixel-agent', mode: 'read' }]);
    expect(next.store.programs).toEqual([]);
  });

  it('does not keep a Deny at the until-quit level', () => {
    const state = start('ask_once_session');
    expect(applyAnswer(state, named('pixel-agent'), { mode: 'blocked', remember: true }, at(1))).toBe(state);
  });

  it('remembers nothing at the other levels or for an unnamed program', () => {
    for (const level of ['ask_every', 'allow_all'] as const) {
      const state = start(level);
      expect(applyAnswer(state, named('pixel-agent'), { mode: 'edit', remember: true }, at(1))).toBe(state);
    }
    const state = start('ask_once_remember');
    expect(applyAnswer(state, { name: null, version: null }, { mode: 'edit', remember: true }, at(1))).toBe(state);
  });
});

describe('reading stored settings', () => {
  it('falls back to the defaults for junk', () => {
    expect(normalizeTrustStore(undefined)).toEqual(DEFAULT_TRUST_STORE);
    expect(normalizeTrustStore('x')).toEqual(DEFAULT_TRUST_STORE);
    expect(normalizeTrustStore({ level: 'nope', allowAllMode: 'nope', programs: 'nope' })).toEqual(DEFAULT_TRUST_STORE);
  });

  it('keeps good entries, normalizes keys and drops bad ones', () => {
    const good = { key: ' Pixel-Agent ', displayName: 'Pixel-Agent', mode: 'edit', firstApproved: at(1), lastConnected: at(2), lastVersion: null };
    const store = normalizeTrustStore({
      level: 'allow_all',
      allowAllMode: 'edit',
      programs: [good, { key: '', displayName: 'x', mode: 'edit' }, 5, { ...good, mode: 'root' }, { ...good, key: 'PIXEL-AGENT' }],
    });
    expect(store.level).toBe('allow_all');
    expect(store.allowAllMode).toBe('edit');
    expect(store.programs.map((program) => program.key)).toEqual(['pixel-agent']);
  });

  it('cuts a stored list longer than the cap', () => {
    const programs = Array.from({ length: 70 }, (_unused, index) => ({
      key: `p${index}`,
      displayName: `p${index}`,
      mode: 'read',
      firstApproved: at(0),
      lastConnected: at(index % 60),
      lastVersion: null,
    }));
    expect(normalizeTrustStore({ level: 'ask_once_remember', allowAllMode: 'read', programs }).programs).toHaveLength(64);
  });
});
