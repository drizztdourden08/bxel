/* @layer renderer-app @kind test */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { describe, expect, it, vi } from 'vitest';
import { COMMAND_ZONE } from '../../src/keymap/command-zone.constants';
import { COMMAND_ID } from '../../src/keymap/keymap.constants';
import { SELECTION_COMMAND_ID } from '../../src/keymap/selection-command-id.constants';
import { SHEET_COMMAND } from '../../src/keymap/sheet-command-id.constants';
import { TILEMAP_COMMAND } from '../../src/keymap/tilemap-command-id.constants';
import { findCommand as find } from '../keymap/find-command';
import { at, BLOCK, openRig } from './selection-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../keymap/brock-react-mock')).brockReactMock());

const DELETE_OWNERS: ReadonlyArray<readonly [string, string]> = [
  [SELECTION_COMMAND_ID.delete, COMMAND_ZONE.canvas],
  [COMMAND_ID.layerDelete, COMMAND_ZONE.layers],
  [SHEET_COMMAND.askDeleteSprite, COMMAND_ZONE.sprites],
  ['timeline.delete', COMMAND_ZONE.timeline],
  [TILEMAP_COMMAND.deleteTile, COMMAND_ZONE.tileset],
];

const owner = (id: string): CommandDef => find(id);

describe('the Delete chord', () => {
  it.each(DELETE_OWNERS)('belongs to %s inside the %s zone only', (id, zone) => {
    expect(owner(id).chord).toBe('Delete');
    expect(owner(id).zone).toBe(zone);
    expect(owner(id).whileTyping).toBe(false);
  });

  it('has one owner per zone, so the focused panel decides what is deleted', () => {
    const zones = DELETE_OWNERS.map(([id]) => owner(id).zone);
    expect(new Set(zones).size).toBe(DELETE_OWNERS.length);
  });

  it('carries no focus check of its own on the canvas command, only the rule that something is selected', () => {
    const rig = openRig();
    expect(owner(SELECTION_COMMAND_ID.delete).when?.()).toBe(false);
    rig.select(BLOCK);
    expect(owner(SELECTION_COMMAND_ID.delete).when?.()).toBe(true);
  });

  it('clears the selected pixels from the canvas zone', () => {
    const rig = openRig();
    rig.paint(BLOCK, 7);
    rig.select(BLOCK);
    void owner(SELECTION_COMMAND_ID.delete).run();
    expect(rig.pixels()[at(5, 5)]).toBe(0);
    expect(rig.target().sprite.layers).toHaveLength(1);
  });

  it('deletes the current layer from the layers zone', () => {
    const rig = openRig();
    void owner(COMMAND_ID.layerAdd).run();
    expect(rig.target().sprite.layers).toHaveLength(2);
    void owner(COMMAND_ID.layerDelete).run();
    expect(rig.target().sprite.layers).toHaveLength(1);
  });

  it('keeps Escape for the shell escape stack, not for a command chord', () => {
    expect(find(SELECTION_COMMAND_ID.cancel).chord).toBeUndefined();
    expect(find(SELECTION_COMMAND_ID.apply).chord).toBe('Enter');
  });
});
