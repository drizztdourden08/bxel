/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { check } from './app-tools-check';
import { fake } from './app-tools-fake';
import { call, reset } from './app-tools-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./app-tools-mock')).brockMock());

const { ok, code } = check;

beforeEach(reset);

describe('list_layout and set_layout', () => {
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

  it('stops at an op that fails and names it, keeping the ops before it', async () => {
    const outcome = await call('set_layout', { ops: [{ op: 'dock', widget: 'timeline', side: 'left' }, { op: 'show', widget: 'players' }, { op: 'hide', widget: 'timeline' }] });
    expect(outcome).toMatchObject({ ok: false, error: { code: 'LAYOUT_INVALID', path: 'ops.1' } });
    expect(JSON.stringify(outcome)).toContain('Op 2 (show) failed. Unknown widget');
    expect(fake.calls).toEqual(['dock timeline {"side":"left"}']);
  });

  it('refuses a resize with neither a size nor a rect', async () => {
    expect(await code('set_layout', { ops: [{ op: 'resize', widget: 'timeline' }] })).toBe('LAYOUT_INVALID');
  });
});
