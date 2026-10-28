/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { slotsOf } from '../../src/editor/tool-catalogue/slots-of';
import type { ToolSlot } from '../../src/editor/tool-catalogue/tool-catalogue.type';
import { SLOT_GROUPS, TOOL_SLOTS } from '../../src/editor/tool-catalogue/tool-catalogue.constants';
import { toolIds } from '../../src/editor/tool-catalogue/tool-ids';
import { APP_COMMANDS } from '../../src/keymap/app-commands.constants';
import { COMMAND_ID } from '../../src/keymap/keymap.constants';
import { TOOL_COMMAND } from '../../src/keymap/option-command-id.constants';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./tools-harness')).toolsBrockMock());

const commandIds = new Set(APP_COMMANDS.map((def) => def.id));

const labelsOf = (id: string): string[] => (slotsOf('sprite').find((slot) => slot.id === id)?.members ?? []).map((member) => member.label);

const groupRank = (slot: ToolSlot): number => SLOT_GROUPS.findIndex((group) => group.id === slot.group);

const allMembers = () => TOOL_SLOTS.flatMap((slot) => [...slot.members]);

describe('the tool catalogue', () => {
  it('gives every slot and member a unique id, a name and a description', () => {
    const slotIds = TOOL_SLOTS.map((slot) => slot.id);
    const memberIds = allMembers().map((member) => member.id);
    expect(new Set(slotIds).size).toBe(slotIds.length);
    expect(new Set(memberIds).size).toBe(memberIds.length);
    for (const slot of TOOL_SLOTS) {
      expect(slot.members.length).toBeGreaterThan(0);
      for (const member of slot.members) {
        expect(member.label.trim()).not.toBe('');
        expect(member.description.length).toBeGreaterThan(10);
        expect(member.tool).toBe(slot.tool);
      }
    }
  });

  it('feeds one select command per tool, on the key of its slot', () => {
    for (const tool of toolIds()) expect(commandIds.has(COMMAND_ID.tool(tool))).toBe(true);
    const keys = APP_COMMANDS.filter((def) => def.id.startsWith('tool.select_')).map((def) => def.chord);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('feeds a cycle back command for every slot with variants and the fill', () => {
    for (const tool of ['shape', 'select', 'fill'] as const) expect(commandIds.has(TOOL_COMMAND.cycleBack(tool))).toBe(true);
    expect(commandIds.has(TOOL_COMMAND.previous)).toBe(true);
  });

  it('gives the map its own member ids and keeps the same keys', () => {
    const map = slotsOf('map');
    expect(map.map((slot) => slot.members[0]?.id)).toEqual(['map.place', 'map.erase', 'map.fill', 'map.pick', 'map.rect', 'map.select', 'zoom', 'hand']);
    expect(map.map((slot) => slot.key)).toEqual(['b', 'e', 'g', 'i', 'u', 'm', 'z', 'h']);
  });

  it('shows only the view group on a sheet and lists groups in order', () => {
    expect(slotsOf('sheet').map((slot) => slot.id)).toEqual(['zoom', 'hand']);
    const order = slotsOf('sprite').map(groupRank);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(labelsOf('shape')).toEqual(['Line', 'Rectangle', 'Ellipse']);
    expect(slotsOf('sprite').find((slot) => slot.id === 'select')?.members).toHaveLength(6);
  });

  it('shows the same slots on a sprite and a tile and lists them for no document', () => {
    expect(slotsOf('tile')).toEqual(slotsOf('sprite'));
    expect(slotsOf('none')).toEqual(slotsOf('sprite'));
  });
});
