/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { slotsOf } from '../../src/editor/tool-catalogue/slots-of';
import { useToolPrefsStore } from '../../src/stores/useToolPrefsStore';
import { check } from './app-tools-check';
import { fake } from './app-tools-fake';
import { LIMIT_REASON, LIMITED } from './app-tools-layout-mock';
import { call, reset } from './app-tools-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./app-tools-mock')).brockMock());

const { ok, code } = check;

beforeEach(reset);

describe('S2 list_layout and set_layout', { tags: ['standard'] }, () => {
  it('lists the widgets, the toolbars and the presets', async () => {
    const seen = await ok('list_layout', {});
    expect(seen).toMatchObject({ presets: ['Default'] });
    expect((seen.widgets as { id: string }[])[0]).toMatchObject({ id: 'timeline', placement: 'docked', side: 'bottom', size: 200 });
    expect((seen.toolbars as { id: string }[])[0]).toMatchObject({ id: 'tools', side: 'left', labels: false });
  });

  it('docks a widget on the right at 300 px, moves a toolbar and turns on its labels, in order', async () => {
    const done = await ok('set_layout', {
      ops: [
        { op: 'dock', widget: 'timeline', side: 'right', size: 300 },
        { op: 'toolbarSide', toolbar: 'tools', side: 'right', row: 1 },
        { op: 'toolbarLabels', toolbar: 'tools', on: true },
        { op: 'float', widget: 'timeline', rect: { width: 320, height: 240 } },
        { op: 'resize', widget: 'timeline', size: 280 },
        { op: 'applyPreset', name: 'Default' },
      ],
    });
    expect(done.applied).toBe(6);
    expect(fake.calls).toEqual([
      'dock timeline {"side":"right","size":300}',
      'toolbarSide tools right 1',
      'toolbarLabels tools true',
      'float timeline {"width":320,"height":240}',
      'resize timeline 280',
      'applyPreset Default',
    ]);
    expect(fake.announced.at(-1)).toContain('changed the layout');
  });

  it('reports the reason when a resize ends at another size than asked', async () => {
    const done = await ok('set_layout', { ops: [{ op: 'resize', widget: 'timeline', size: LIMITED }] });
    expect(done.notes).toEqual([`Op 1 (resize) ended at 1200 px. ${LIMIT_REASON}`]);
  });

  it('stops at an op that fails and names it, keeping the ops before it', async () => {
    const outcome = await call('set_layout', { ops: [{ op: 'dock', widget: 'timeline', side: 'left' }, { op: 'show', widget: 'players' }, { op: 'hide', widget: 'timeline' }] });
    expect(outcome).toMatchObject({ ok: false, error: { code: 'LAYOUT_INVALID', path: 'ops.1' } });
    expect(JSON.stringify(outcome)).toContain('Op 2 (show) failed. Unknown widget');
    expect(fake.calls).toEqual(['dock timeline {"side":"left"}']);
    expect(JSON.stringify(outcome)).toContain('Known widgets: timeline');
  });
});

describe('S2 the toolbar and tool ops of set_layout', { tags: ['standard'] }, () => {
  it('sets the toolbar columns and hidden items', async () => {
    const done = await ok('set_layout', {
      ops: [
        { op: 'toolbarColumns', toolbar: 'tools', columns: 2 },
        { op: 'toolbarItems', toolbar: 'tools', hidden: ['pencil'] },
      ],
    });
    expect(done.applied).toBe(2);
    expect(fake.calls).toEqual(['toolbarColumns tools 2', 'toolbarItems tools pencil']);
  });

  it('hides a tool member, shows it again and resets a surface', async () => {
    const member = slotsOf('sprite').flatMap((slot) => slot.members)[0];
    if (!member) throw new Error('no member');
    await ok('set_layout', { ops: [{ op: 'hideTool', member: member.id }] });
    expect(useToolPrefsStore.getState().hiddenMembers).toEqual([member.id]);
    await ok('set_layout', { ops: [{ op: 'showTool', member: member.id }, { op: 'hideTool', member: member.id }, { op: 'resetTools', surface: 'sprite' }] });
    expect(useToolPrefsStore.getState().hiddenMembers).toEqual([]);
  });

  it('refuses a hide of a tool member that does not exist', async () => {
    expect(await code('set_layout', { ops: [{ op: 'hideTool', member: 'nope' }] })).toBe('LAYOUT_INVALID');
  });

  it('lists a hidden member in list_tools with its hidden flag', async () => {
    const member = slotsOf('sprite').flatMap((slot) => slot.members)[0];
    if (!member) throw new Error('no member');
    useToolPrefsStore.getState().resetLayout();
    useToolPrefsStore.getState().toggleHidden(member.id);
    const seen = await ok('list_tools', { surface: 'sprite' });
    const found = (seen.slots as { members: { id: string; hidden: boolean }[] }[]).flatMap((slot) => slot.members).find((each) => each.id === member.id);
    expect(found?.hidden).toBe(true);
    useToolPrefsStore.getState().resetLayout();
  });

  it('refuses a resize with neither a size nor a rect', async () => {
    expect(await code('set_layout', { ops: [{ op: 'resize', widget: 'timeline' }] })).toBe('LAYOUT_INVALID');
  });
});
