/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { COMMAND_ID } from '../../src/keymap/keymap.constants';
import { TOOLS } from '../../src/editor/tools.constants';
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
    const html = renderHint({ name: pencil.label, description: pencil.description, shortcuts: [{ command: COMMAND_ID.tool('pencil') }] });
    expect(html).toContain('Pencil');
    expect(html).toContain(pencil.description);
    expect(caps(html)).toBe(1);
  });

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
