/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { ASSET_SETTINGS_COMMAND } from '../../src/config-entry/config-entry.constants';
import { canvasBaseEntries } from '../../src/views/EditorCanvas/behavior/canvas-base-entries';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../keymap/brock-react-mock')).brockReactMock());

describe('W7 the canvas context menu', { tags: ['standard'] }, () => {
  it('ends with Sprite properties, which opens the asset settings', () => {
    const entries = canvasBaseEntries(null, false);
    const found = entries.find((entry) => typeof entry === 'object' && 'command' in entry && entry.command === ASSET_SETTINGS_COMMAND);
    expect(found).toMatchObject({ label: 'Sprite properties' });
  });

  it('offers Snap, Mirror view, Split view and Add reference image on a sprite, not on a tile', () => {
    const commands = (tile: boolean): string[] =>
      canvasBaseEntries(null, tile).flatMap((entry) => (typeof entry === 'object' && 'command' in entry && entry.hidden !== true ? [String(entry.command)] : []));
    expect(commands(false)).toEqual(expect.arrayContaining(['view.toggle_snap', 'view.toggle_mirror', 'view.toggle_split', 'view.add_reference']));
    expect(commands(true)).not.toContain('view.add_reference');
  });
});
