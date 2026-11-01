/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { gesture } from '../../src/editor/gesture-state';
import { useToolPresetStore } from '../../src/stores/useToolPresetStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { check } from './app-tools-check';
import { fake } from './app-tools-fake';
import { reset } from './app-tools-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./app-tools-mock')).brockMock());

const { ok, code } = check;

const records = (value: unknown): Record<string, unknown>[] => value as Record<string, unknown>[];

beforeEach(() => {
  reset();
  useToolPresetStore.setState({ user: [] });
  gesture.dragging = false;
});

describe('K2 list_tools', { tags: ['standard'] }, () => {
  it('lists the slots of a surface with their members, option schemas and the presets', async () => {
    const listed = await ok('list_tools', { surface: 'sprite' });
    expect(listed.surface).toBe('sprite');
    const slots = records(listed.slots);
    const pencil = slots.find((slot) => slot.tool === 'pencil');
    expect(pencil).toBeDefined();
    const sizeOption = records(pencil?.options).find((option) => option.id === 'pencil.size');
    expect(sizeOption).toMatchObject({ kind: 'number', tool: 'pencil', applies: true });
    expect(typeof sizeOption?.min).toBe('number');
    expect(typeof sizeOption?.max).toBe('number');
    expect(records(listed.presets).map((preset) => preset.id)).toContain('builtin.pencil-2');
  });
});

describe('K2 the preset tools', { tags: ['standard'] }, () => {
  it('applies a built in preset to the tool and its options', async () => {
    const applied = await ok('apply_preset', { id: 'builtin.pencil-3' });
    expect(applied.preset).toMatchObject({ id: 'builtin.pencil-3', builtin: true, member: 'pencil' });
    expect(useToolStore.getState().tool).toBe('pencil');
    expect(fake.announced.at(-1)).toContain('applied the preset');
  });

  it('saves, lists, updates and deletes a user preset', async () => {
    const saved = await ok('save_preset', { member: 'pencil', name: 'Thick', fields: { 'pencil.size': 4 } });
    const id = (saved.preset as { id: string }).id;
    expect(saved.preset).toMatchObject({ name: 'Thick', builtin: false, fields: { 'pencil.size': 4 } });
    expect(records((await ok('list_presets', { member: 'pencil' })).presets).map((preset) => preset.id)).toContain(id);
    const changed = await ok('update_preset', { id, name: 'Thicker', fields: { 'pencil.size': 6 } });
    expect(changed.preset).toMatchObject({ id, name: 'Thicker', fields: { 'pencil.size': 6 } });
    expect(await ok('delete_preset', { id })).toMatchObject({ deleted: id });
    expect(useToolPresetStore.getState().user).toEqual([]);
  });

  it('refuses an unknown member, an option the tool does not hold, a bad value and an empty preset', async () => {
    expect(await code('save_preset', { member: 'nope', name: 'X', fields: { 'pencil.size': 2 } })).toBe('VIEW_INVALID');
    expect(await code('save_preset', { member: 'pencil', name: 'X', fields: { 'fill.area': 'global' } })).toBe('VIEW_INVALID');
    expect(await code('save_preset', { member: 'pencil', name: 'X', fields: { 'pencil.size': 'big' } })).toBe('VIEW_INVALID');
    expect(await code('save_preset', { member: 'pencil', name: 'X', fields: {} })).toBe('VIEW_INVALID');
    expect(useToolPresetStore.getState().user).toEqual([]);
  });

  it('keeps built in presets whole and names an unknown id', async () => {
    expect(await code('update_preset', { id: 'builtin.pencil-1', name: 'Mine' })).toBe('VIEW_INVALID');
    expect(await code('delete_preset', { id: 'builtin.pencil-1' })).toBe('VIEW_INVALID');
    expect(await code('apply_preset', { id: 'usr.missing' })).toBe('VIEW_INVALID');
  });

  it('refuses to change the tool while the owner draws', async () => {
    gesture.dragging = true;
    expect(await code('apply_preset', { id: 'builtin.pencil-2' })).toBe('TOOL_BUSY');
  });
});
