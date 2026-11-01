/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { modeOf } from '../../src/editor/selection/mode-of';
import { SELECT_MODES } from '../../src/editor/selection/selection.constants';
import { MODE_KEYS } from '../../src/editor/tool-descriptions.constants';
import { slotsOf } from '../../src/editor/tool-catalogue/slots-of';
import { railOf } from '../ui-context/rail-of';
import { canvasHelp } from '../../src/views/EditorStatus/behavior/canvas-help';

vi.mock('@drizztdourden08/brock-react', async () => {
  const base = (await import('../keymap/brock-react-mock')).brockReactMock();
  const chords = (await import('./brock-chords')).brockChords();
  return { ...base, commands: { ...base.commands, ...chords.commands } };
});

describe('K1 the tool rail', { tags: ['critical'] }, () => {
  it('names a map tool button with the tool alone and puts the key in the hint', () => {
    const toggles = railOf('Tm').filter((item) => item.kind === 'toggle');
    expect(toggles.map((item) => item.label)).toEqual(slotsOf('map').map((slot) => slot.label));
    for (const item of toggles) expect(item.label).not.toMatch(/[()+]/);
  });

  it('lists every tool of the editor as a toggle named with the slot and its current member', () => {
    const toggles = railOf('Sp').filter((item) => item.kind === 'toggle');
    expect(toggles).toHaveLength(slotsOf('sprite').length);
    expect(toggles.map((item) => item.label)).toContain('Line');
    expect(toggles.map((item) => item.label)).toContain('Select, Rectangle');
  });
});

describe('K1 the selection mode keys', { tags: ['critical'] }, () => {
  it('match the keys the selection tool reads', () => {
    for (const mode of SELECT_MODES) {
      const keys = MODE_KEYS[mode];
      const held = { shiftKey: keys.includes('shift'), altKey: keys.includes('alt') };
      expect(modeOf(held, 'replace')).toBe(mode);
    }
  });
});

describe('K1 the status bar help', { tags: ['critical'] }, () => {
  it('switches to the sheet rows in Sheet mode', () => {
    const sheet = canvasHelp('pencil', 'sheet');
    expect(sheet.description).toContain('sheet');
    expect(sheet.shortcuts?.some((row) => row.label === 'Select a range')).toBe(true);
  });
});
