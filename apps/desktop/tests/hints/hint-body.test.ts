/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { COMMAND_ID } from '../../src/keymap/keymap.constants';
import { toolHint } from '../../src/views/ToolRail/behavior/tool-hint';
import { TOOLS } from '../../src/editor/tools.constants';
import { commandKeys } from '../../src/views/ActionHint/behavior/command-keys';
import { bind, unbindAll } from './brock-chords';
import { renderHint } from './hint-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./brock-chords')).brockChords());

const caps = (html: string): number => html.match(/class="shortcut(?: [^"]*)?"/g)?.length ?? 0;

beforeEach(unbindAll);

describe('the hint body', () => {
  it('shows the name, the description and the key of a command', () => {
    bind(COMMAND_ID.tool('pencil'), ['B']);
    const pencil = TOOLS.find((tool) => tool.id === 'pencil');
    if (!pencil) throw new Error('no pencil');
    const html = renderHint(toolHint(pencil));
    expect(html).toContain('Pencil');
    expect(html).toContain(pencil.description);
    expect(caps(html)).toBe(1);
  });

  it('follows a rebind of the command', () => {
    bind(COMMAND_ID.undo, ['Mod+Z']);
    expect(commandKeys(COMMAND_ID.undo)).toEqual([['ctrl', 'Z']]);
    bind(COMMAND_ID.undo, ['Mod+Shift+U']);
    expect(commandKeys(COMMAND_ID.undo)).toEqual([['ctrl', 'shift', 'U']]);
    bind(COMMAND_ID.undo, []);
    expect(commandKeys(COMMAND_ID.undo)).toEqual([]);
  });

  it('lists every chord of a command and joins them with or', () => {
    bind(COMMAND_ID.zoomIn, ['Plus', '=']);
    const html = renderHint({ name: 'Zoom in', description: 'Zoom in.', shortcuts: [{ command: COMMAND_ID.zoomIn }] });
    expect(caps(html)).toBe(2);
    expect(html).toContain('or');
  });

  it('draws no key for a command nobody bound', () => {
    const html = renderHint({ name: 'Duplicate layer', description: 'Copy it.', shortcuts: [{ command: COMMAND_ID.layerDuplicate }] });
    expect(caps(html)).toBe(0);
    expect(html).toContain('Duplicate layer');
  });

  it('draws fixed keys and mouse gestures next to a label', () => {
    const html = renderHint({
      name: 'Pencil',
      description: 'Draw.',
      shortcuts: [{ label: 'Straight line', keys: ['shift'], mouse: 'drag' }, { label: 'Nudge with the arrow keys' }],
    });
    expect(caps(html)).toBe(1);
    expect(html).toContain('Straight line');
    expect(html).toContain('Nudge with the arrow keys');
  });
});
