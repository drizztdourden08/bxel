/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { callMcp } from './support/call-mcp';
import type { McpRig } from './support/mcp-rig.type';
import { openFullRig } from './support/open-full-rig';
import { useRig } from './support/use-rig';

type Widget = { id: string; label: string; visible: boolean; placement: string | null; side: string | null; size: number | null; available: boolean };

type Toolbar = { id: string; shown: boolean; side: string | null; labels: boolean };

const layout = async ({ link }: McpRig) => {
  const listed = await callMcp(link.client, 'list_layout');
  expect(listed.ok).toBe(true);
  return listed.data as { widgets: Widget[]; toolbars: Toolbar[]; presets: string[] };
};

const widgetOf = async (rig: McpRig, id: string): Promise<Widget> => {
  const found = (await layout(rig)).widgets.find((each) => each.id === id);
  if (!found) throw new Error(`no widget ${id}`);
  return found;
};

const listsTheLayout = async (rig: McpRig): Promise<void> => {
  const { widgets, toolbars } = await layout(rig);
  expect(widgets.length).toBeGreaterThanOrEqual(5);
  expect(toolbars.map((toolbar) => toolbar.id)).toEqual(expect.arrayContaining(['tools']));
  expect(widgets.some((widget) => widget.visible && widget.placement === 'docked')).toBe(true);
};

const docksAWidgetAtASizeAndMovesIt = async (rig: McpRig): Promise<void> => {
  const { link } = rig;
  const target = (await layout(rig)).widgets.find((widget) => widget.visible && widget.placement === 'docked' && widget.side !== 'right');
  if (!target) throw new Error('no docked widget to move');
  const beside = (await layout(rig)).widgets.filter((widget) => widget.visible && widget.placement === 'docked' && widget.side === 'left' && widget.id !== target.id);
  await callMcp(link.client, 'set_layout', { ops: beside.map((widget) => ({ op: 'hide', widget: widget.id })) });
  const docked = await callMcp(link.client, 'set_layout', { ops: [{ op: 'dock', widget: target.id, side: 'right', size: 300 }] });
  expect(docked.data).toMatchObject({ ok: true, applied: 1 });
  const after = await widgetOf(rig, target.id);
  expect(after).toMatchObject({ placement: 'docked', side: 'right' });
  expect(Math.abs((after.size ?? 0) - 300)).toBeLessThanOrEqual(12);
  const floated = await callMcp(link.client, 'set_layout', { ops: [{ op: 'float', widget: target.id, rect: { x: 80, y: 80, width: 320, height: 260 } }] });
  expect(floated.ok).toBe(true);
  expect(await widgetOf(rig, target.id)).toMatchObject({ placement: 'floating' });
  const hidden = await callMcp(link.client, 'set_layout', { ops: [{ op: 'hide', widget: target.id }, { op: 'show', widget: target.id }] });
  expect(hidden.data).toMatchObject({ ok: true, applied: 2 });
  expect((await widgetOf(rig, target.id)).visible).toBe(true);
};

const movesAToolbarAndRefusesNonsense = async (rig: McpRig): Promise<void> => {
  const { link } = rig;
  const before = (await layout(rig)).toolbars.find((toolbar) => toolbar.id === 'tools');
  const side = before?.side === 'right' ? 'left' : 'right';
  const moved = await callMcp(link.client, 'set_layout', { ops: [{ op: 'toolbarSide', toolbar: 'tools', side }, { op: 'toolbarLabels', toolbar: 'tools', on: true }] });
  expect(moved.data).toMatchObject({ ok: true, applied: 2 });
  expect((await layout(rig)).toolbars.find((toolbar) => toolbar.id === 'tools')).toMatchObject({ side, labels: true });
  const unknown = await callMcp(link.client, 'set_layout', { ops: [{ op: 'show', widget: 'nope' }] });
  expect(unknown.code).toBe('LAYOUT_INVALID');
  expect(JSON.stringify(unknown.data)).toContain('nope');
  const reset = await callMcp(link.client, 'set_layout', { ops: [{ op: 'resetWidgets' }, { op: 'resetToolbars' }] });
  expect(reset.ok).toBe(true);
};

describe('layout: a program docks a widget and moves a toolbar in the owner window', () => {
  const rig = useRig(openFullRig);
  test('lists the widgets and toolbars', () => listsTheLayout(rig()));
  test('docks a widget on the right at 300 px, floats it, hides and shows it', () => docksAWidgetAtASizeAndMovesIt(rig()));
  test('moves a toolbar, turns its labels on, refuses an unknown widget and resets', () => movesAToolbarAndRefusesNonsense(rig()));
});
