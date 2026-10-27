/* @layer tests @kind test */
import { PRESETS } from '@bxel/mcp';
import type { Grant } from '@bxel/mcp';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { assistantMain } from '../../electron/assistant/assistant-main';
import type { LiveSession } from '../../electron/assistant/assistant.type';
import { askFlush } from '../../electron/assistant/ask-flush';
import { quitSoon } from '../../electron/assistant/quit-soon';
import { stopBxel } from '../../electron/assistant/stop-bxel';

vi.mock('../../electron/assistant/quit-soon', () => ({ quitSoon: vi.fn() }));
vi.mock('../../electron/assistant/ask-flush', () => ({ askFlush: vi.fn().mockResolvedValue({ unsaved: [{ documentId: 'doc_1', name: 'a.bxsprite' }] }) }));

const session = (grant: Grant, launchedThis = false): LiveSession => ({
  token: 't'.repeat(64),
  sessionId: 's1',
  connectionId: 'c1',
  launchedThis,
  granted: grant,
  grant,
  mode: 'edit',
  programKey: 'pixel agent',
  trust: 'remembered',
  client: { name: 'Pixel Agent', version: null },
  displayName: 'Pixel Agent',
  connectedAt: 1,
  lastCallAt: 1,
});

const restart: Grant = { ...PRESETS.full_control.grant, special: { mayRestart: true } };

const state = { ...assistantMain, instance: { window: 'visible' as const, started: false, launchToken: null } };

const codeOf = (reply: Awaited<ReturnType<typeof stopBxel>>): string | null => (reply.outcome.ok ? null : reply.outcome.error.code);

describe('stopping a Bxel the owner opened', () => {
  beforeEach(() => {
    vi.mocked(quitSoon).mockClear();
    vi.mocked(askFlush).mockClear();
  });

  it('is refused without the special permission', async () => {
    const reply = await stopBxel(state, session(PRESETS.full_control.grant), { unsaved: 'recover' });
    expect(codeOf(reply)).toBe('STOP_NOT_ALLOWED');
    expect(quitSoon).not.toHaveBeenCalled();
  });

  it('is allowed with the permission, keeping unsaved work as recovery', async () => {
    const reply = await stopBxel(state, session(restart), { unsaved: 'recover' });
    expect(reply.outcome).toMatchObject({ ok: true, stopped: true, recovered: ['doc_1'], discarded: [] });
    expect(quitSoon).toHaveBeenCalledTimes(1);
  });

  it('refuses to discard unsaved work even with the permission, and stops nothing', async () => {
    const reply = await stopBxel(state, session(restart), { unsaved: 'discard' });
    expect(codeOf(reply)).toBe('STOP_NOT_ALLOWED');
    expect(askFlush).not.toHaveBeenCalled();
    expect(quitSoon).not.toHaveBeenCalled();
  });

  it('still refuses unsaved work by default', async () => {
    const reply = await stopBxel(state, session(restart), {});
    expect(codeOf(reply)).toBe('UNSAVED_CHANGES');
    expect(quitSoon).not.toHaveBeenCalled();
  });
});

describe('stopping the headless Bxel a session started', () => {
  it('works without the permission and may discard', async () => {
    const headless = { ...state, instance: { window: 'headless' as const, started: true, launchToken: 'x' } };
    const reply = await stopBxel(headless, session(PRESETS.full_control.grant, true), { unsaved: 'discard' });
    expect(reply.outcome).toMatchObject({ ok: true, stopped: true, discarded: ['doc_1'] });
  });
});
