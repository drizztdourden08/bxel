/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { chordKeys } from '../../src/views/ActionHint/behavior/chord-keys';

describe('chordKeys', () => {
  it('turns a plain letter chord into one key', () => {
    expect(chordKeys('B', false)).toEqual(['B']);
    expect(chordKeys('[', false)).toEqual(['[']);
  });

  it('turns the Mod key into Ctrl on Windows and Cmd on a Mac', () => {
    expect(chordKeys('Mod+Z', false)).toEqual(['ctrl', 'Z']);
    expect(chordKeys('Mod+Z', true)).toEqual(['cmd', 'Z']);
  });

  it('keeps modifiers in the order Brock writes them', () => {
    expect(chordKeys('Mod+Alt+Shift+S', false)).toEqual(['ctrl', 'alt', 'shift', 'S']);
    expect(chordKeys('Mod+Shift+Z', true)).toEqual(['cmd', 'shift', 'Z']);
  });

  it('names the special keys with the Tessera key names', () => {
    expect(chordKeys('Escape', false)).toEqual(['esc']);
    expect(chordKeys('Plus', false)).toEqual(['+']);
    expect(chordKeys('Mod+Up', false)).toEqual(['ctrl', 'up']);
    expect(chordKeys('Delete', false)).toEqual(['delete']);
    expect(chordKeys('F1', false)).toEqual(['F1']);
  });

  it('gives no keys for a chord it cannot read', () => {
    expect(chordKeys('Hyper+Q', false)).toEqual([]);
    expect(chordKeys('Mod+Nonsense', false)).toEqual([]);
    expect(chordKeys('', false)).toEqual([]);
  });
});
