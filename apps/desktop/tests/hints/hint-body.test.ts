/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { COMMAND_ID } from '../../src/keymap/keymap.constants';
import { bind, unbindAll } from './brock-chords';
import { renderHint } from './hint-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./brock-chords')).brockChords());

const caps = (html: string): number => html.match(/class="shortcut(?: [^"]*)?"/g)?.length ?? 0;

beforeEach(unbindAll);

describe('S1 the hint body', { tags: ['standard'] }, () => {
  it('follows a rebind of the command', () => {
    const undo = { name: 'Undo', description: 'Take back the last edit.', shortcuts: [{ command: COMMAND_ID.undo }] };
    bind(COMMAND_ID.undo, ['Mod+Z']);
    const first = renderHint(undo);
    expect(caps(first)).toBe(1);
    bind(COMMAND_ID.undo, ['Mod+Shift+U']);
    const second = renderHint(undo);
    expect(caps(second)).toBe(1);
    expect(second).not.toBe(first);
    bind(COMMAND_ID.undo, []);
    expect(caps(renderHint(undo))).toBe(0);
  });
});
