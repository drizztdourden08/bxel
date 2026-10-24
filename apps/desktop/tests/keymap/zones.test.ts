/* @layer renderer-app @kind test */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { describe, expect, it, vi } from 'vitest';
import type { ZoneKey } from '../../src/keymap/zone-key.type';
import { APP_COMMANDS } from '../../src/keymap/app-commands.constants';
import { COMMAND_ZONE } from '../../src/keymap/command-zone.constants';
import { LAYER_RENAME_KEY, PROJECT_RENAME_KEY, PROJECT_TRASH_KEY, SPRITE_SELECT_ALL_KEY } from '../../src/keymap/zone-key.constants';
import { canonical, chordsOf, pairsOf, shares } from './chord-table';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./brock-react-mock')).brockReactMock());

const EDIT_CHORDS: ReadonlySet<string> = new Set(['ctrl+a', 'ctrl+c', 'ctrl+x', 'ctrl+v', 'ctrl+z', 'ctrl+y', 'ctrl+shift+z']);

const EDIT_IDS = ['history.redo', 'history.undo', 'selection.copy', 'selection.cut', 'selection.paste', 'selection.select_all'];

const PANEL_KEYS = [LAYER_RENAME_KEY, PROJECT_RENAME_KEY, PROJECT_TRASH_KEY, SPRITE_SELECT_ALL_KEY];

const sameChord = (def: CommandDef, key: ZoneKey): boolean => chordsOf(def).map(canonical).includes(canonical(String(key.chord)));

const takenInZone = (key: ZoneKey): boolean => APP_COMMANDS.some((def) => sameChord(def, key) && shares(def.zone, key.zone));

const isEditCommand = (def: CommandDef): boolean => chordsOf(def).some((chord) => EDIT_CHORDS.has(canonical(chord)));

describe('the command zones', () => {
  it('names a zone for every panel that owns keys', () => {
    expect(Object.values(COMMAND_ZONE).sort()).toEqual(['canvas', 'layers', 'project', 'sprites', 'tileset', 'timeline']);
  });

  it('gives Delete one owner per zone in the app table', () => {
    const zones = APP_COMMANDS.filter((def) => chordsOf(def).includes('Delete')).map((def) => def.zone);
    expect([...zones].sort()).toEqual(['canvas', 'layers', 'sprites', 'tileset', 'timeline']);
  });

  it('keeps every unzoned command off a chord that a zoned command uses', () => {
    const zoned = new Set(APP_COMMANDS.filter((def) => def.zone !== undefined).flatMap(pairsOf).map((pair) => pair.key));
    const loose = APP_COMMANDS.filter((def) => def.zone === undefined).flatMap(pairsOf);
    expect(loose.filter((pair) => zoned.has(pair.key))).toEqual([]);
  });

  it('keeps the keys a panel registers off the app chords of its zone', () => {
    expect(PANEL_KEYS.filter(takenInZone)).toEqual([]);
  });
});

describe('the native edit commands', () => {
  it('stay off while a text field has the focus, so cut, copy, paste, undo and select all reach it', () => {
    const edits = APP_COMMANDS.filter(isEditCommand);
    expect(edits.map((def) => def.id).sort()).toEqual(EDIT_IDS);
    expect(edits.filter((def) => def.whileTyping !== false)).toEqual([]);
  });
});
