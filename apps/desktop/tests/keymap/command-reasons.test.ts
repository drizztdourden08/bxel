/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { APP_COMMANDS } from '../../src/keymap/app-commands.constants';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./brock-react-mock')).brockReactMock());

const blocked = APP_COMMANDS.filter((def) => def.when?.() === false);

describe('the reason a command is disabled', () => {
  it('finds commands that are disabled with nothing open', () => {
    expect(blocked.length).toBeGreaterThan(50);
  });

  it('is a real sentence for every command that is disabled, never Brock generic text', () => {
    const silent = blocked.filter((def) => (def.reason?.() ?? '').trim() === '').map((def) => def.id);
    expect(silent).toEqual([]);
  });

  it('is null for a command that can run', () => {
    const open = APP_COMMANDS.filter((def) => def.when?.() !== false && def.visible?.() !== false);
    expect(open.filter((def) => def.reason?.() !== null && def.reason?.() !== undefined).map((def) => def.id)).toEqual([]);
  });

  it('says where a hidden command works, and lists it under that place on the keymap page', () => {
    const hidden = APP_COMMANDS.filter((def) => def.visible?.() === false);
    expect(hidden.length).toBeGreaterThan(20);
    expect(hidden.every((def) => def.when?.() !== false)).toBe(true);
    const unplaced = hidden.filter((def) => def.only === undefined && (def.reason?.() ?? '') === '').map((def) => def.id);
    expect(unplaced).toEqual([]);
  });

  it('ends in a full stop and holds no dash', () => {
    const texts = blocked.map((def) => def.reason?.() ?? '');
    expect(texts.filter((text) => !text.endsWith('.') || /[–—]/u.test(text))).toEqual([]);
  });
});
