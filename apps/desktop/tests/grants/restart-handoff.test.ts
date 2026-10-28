/* @layer renderer-app @kind test */
import { PRESETS } from '@bxel/mcp';
import type { Grant } from '@bxel/mcp';
import { describe, expect, it } from 'vitest';
import { inheritedPairing } from '../../electron/assistant/inherited-pairing';
import { readHandoff } from '../../electron/assistant/read-handoff';

const grant: Grant = { ...PRESETS.full_control.grant, special: { mayRestart: true } };

const NOW = 1_800_000_000_000;

const stateWith = (raw: unknown) => ({ handoff: readHandoff(raw) });

const note = (overrides: Record<string, unknown> = {}) => ({ kind: 'assistant-restart', key: 'sample agent', grant, at: NOW, ...overrides });

describe('the restart handoff', () => {
  it('pairs the same program again at the same grant, once, without a prompt', () => {
    const state = stateWith(note());
    const first = inheritedPairing(state, { name: 'Sample Agent', version: '1' }, NOW + 5000);
    expect(first).toMatchObject({ ok: true, mode: 'edit', trust: 'this_launch', grant });
    expect(inheritedPairing(state, { name: 'Sample Agent', version: '1' }, NOW + 6000)).toBeNull();
  });

  it('does not pair another program, and spends the note on the try', () => {
    const state = stateWith(note());
    expect(inheritedPairing(state, { name: 'Other', version: null }, NOW + 1000)).toBeNull();
    expect(inheritedPairing(state, { name: 'Sample Agent', version: null }, NOW + 1000)).toBeNull();
  });

  it('ignores a note older than 60 seconds or from the future', () => {
    expect(inheritedPairing(stateWith(note()), { name: 'Sample Agent', version: null }, NOW + 60_001)).toBeNull();
    expect(inheritedPairing(stateWith(note()), { name: 'Sample Agent', version: null }, NOW - 1)).toBeNull();
  });

  it('ignores a malformed note, a blocked grant and a note of another kind', () => {
    expect(readHandoff(null)).toBeNull();
    expect(readHandoff(note({ kind: 'other' }))).toBeNull();
    expect(readHandoff(note({ key: 4 }))).toBeNull();
    expect(readHandoff(note({ grant: 'full' }))).toBeNull();
    expect(readHandoff(note({ grant: { ...grant, blocked: true } }))).toBeNull();
  });

  it('does nothing without a note', () => {
    expect(inheritedPairing({ handoff: null }, { name: 'Sample Agent', version: null })).toBeNull();
  });
});
