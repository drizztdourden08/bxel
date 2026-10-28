/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { evaluate } from '../../src/ui-context/evaluate';
import { hasRule } from '../../src/ui-context/has-rule';
import { columnContext } from './columns';

describe('the evaluator', () => {
  it('hides what cannot apply to the file type and says nothing about it', () => {
    expect(evaluate('timeline.add_frame', columnContext('Sp'))).toEqual({ state: 'hidden', reason: null });
    expect(evaluate('tool.select_pencil', columnContext('Pa'))).toEqual({ state: 'hidden', reason: null });
  });

  it('disables what applies but lacks state, with a one sentence reason', () => {
    expect(evaluate('selection.copy', columnContext('Sp'))).toEqual({ state: 'disabled', reason: 'Nothing is selected.' });
    expect(evaluate('selection.paste', columnContext('Se'))).toEqual({ state: 'disabled', reason: 'The clipboard is empty.' });
    expect(evaluate('history.undo', columnContext('Sp'))).toEqual({ state: 'disabled', reason: 'There is nothing to undo.' });
    expect(evaluate('project.close', columnContext('Sp'))).toEqual({ state: 'disabled', reason: 'No project is open.' });
  });

  it('shows an item once its state is there', () => {
    expect(evaluate('selection.copy', columnContext('Se')).state).toBe('shown');
    expect(evaluate('selection.paste', columnContext('Se', { clipboard: 'pixels' })).state).toBe('shown');
    expect(evaluate('history.undo', columnContext('Sp', { canUndo: true })).state).toBe('shown');
  });

  it('turns every edit into a disabled item with the read only reason, and leaves the view items live', () => {
    const readOnly = columnContext('Ro');
    expect(evaluate('tool.select_pencil', readOnly)).toEqual({ state: 'disabled', reason: 'This file is open read only. Use Save as to edit a copy.' });
    expect(evaluate('tool.select_picker', readOnly).state).toBe('shown');
    expect(evaluate('tool.select_select', readOnly).state).toBe('shown');
    expect(evaluate('tool.select_zoom', readOnly).state).toBe('shown');
    expect(evaluate('view.toggle_pixel_grid', readOnly).state).toBe('shown');
    expect(evaluate('symmetry.toggle_x', readOnly).state).toBe('shown');
    expect(evaluate('selection.invert', columnContext('Ro', { pixelSelection: true })).state).toBe('shown');
  });

  it('gives the rail its hint with nothing open', () => {
    expect(evaluate('tool.select_pencil', columnContext('N'))).toEqual({ state: 'disabled', reason: 'Open or create an asset to draw.' });
    expect(evaluate('tool.select_zoom', columnContext('N')).state).toBe('disabled');
  });

  it('pastes only a pixel clipboard and cuts only with a selection', () => {
    expect(evaluate('selection.cut', columnContext('Se', { readOnly: true })).state).toBe('disabled');
    expect(evaluate('selection.cut', columnContext('Se')).state).toBe('shown');
  });

  it('lets an unknown id through as shown and knows which ids have a rule', () => {
    expect(hasRule('palette.edit_swatch')).toBe(false);
    expect(evaluate('palette.edit_swatch', columnContext('Pa'))).toEqual({ state: 'shown', reason: null });
    expect(hasRule('tool.select_pencil')).toBe(true);
  });

  it('keeps the image import to an image and the animation commands to animations', () => {
    expect(evaluate('image.import', columnContext('Im')).state).toBe('shown');
    expect(evaluate('image.import', columnContext('Sp')).state).toBe('hidden');
    expect(evaluate('timeline.add_frame', columnContext('An')).state).toBe('shown');
    expect(evaluate('timeline.add_frame', columnContext('Ts')).state).toBe('shown');
    expect(evaluate('timeline.add_frame', columnContext('Tm')).state).toBe('hidden');
  });

  it('retires the old duplicate frame command everywhere', () => {
    for (const column of ['Sp', 'An', 'Ts', 'Sh'] as const) expect(evaluate('frame.duplicate', columnContext(column)).state).toBe('hidden');
  });
});
