/* @layer renderer-app @kind test */
import { BUNDLE_IDS } from '@bxel/mcp';
import { describe, expect, it, vi } from 'vitest';
import { ARGS_KINDS } from '../../src/assistant/command-manifest/args-schemas.constants';
import { MANIFEST } from '../../src/assistant/command-manifest/manifest.constants';
import { manifestOf } from '../../src/assistant/command-manifest/manifest-of';
import { directOf } from '../../src/assistant/tools/direct-commands';
import { APP_COMMANDS } from '../../src/keymap/app-commands.constants';
import { maskOfRuns } from '../../src/assistant/tools/mask-of-runs';
import { runsOfMask } from '../../src/assistant/tools/runs-of-mask';
import { selectionReply } from '../../src/assistant/tools/selection-reply';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../keymap/brock-react-mock')).brockReactMock());

describe('the command manifest', () => {
  it('has an entry for every command the app registers', () => {
    const missing = APP_COMMANDS.map((command) => command.id).filter((id) => !Object.hasOwn(MANIFEST, id));
    expect(missing).toEqual([]);
  });

  it('has no entry for a command that does not exist', () => {
    const known = new Set(APP_COMMANDS.map((command) => command.id));
    expect(Object.keys(MANIFEST).filter((id) => !known.has(id))).toEqual([]);
  });

  it('places each command in a real bundle with an args kind that exists', () => {
    for (const [id, entry] of Object.entries(MANIFEST)) {
      expect(BUNDLE_IDS, id).toContain(entry.area);
      if (entry.args !== null) expect(Object.keys(ARGS_KINDS), id).toContain(entry.args);
    }
  });

  it('lets only a dialog command run directly, and every command with args and a dialog either runs directly or needs show', () => {
    for (const [id, entry] of Object.entries(MANIFEST)) {
      if (directOf(id) !== null) expect(entry.dialog, id).not.toBeNull();
    }
    expect(directOf('transform.rotate')).not.toBeNull();
    expect(directOf('file.open')).toBeNull();
  });

  it('keeps the owner history out of reach and falls back to the shell area for a Brock command', () => {
    expect(manifestOf('history.undo').refuse).toContain('undo tool');
    expect(manifestOf('history.redo').refuse).toContain('undo tool');
    expect(manifestOf('toolbar.hide')).toMatchObject({ area: 'layout', effect: 'app' });
    expect(manifestOf('brock.search')).toMatchObject({ area: 'app_control', effect: 'app' });
  });

  it('marks the zoom, grid and playback commands as show and the edits as edit', () => {
    for (const id of ['view.zoom_in', 'view.toggle_pixel_grid', 'tag.play', 'timeline.toggle_onion', 'timeline.go_to_frame']) expect(MANIFEST[id]?.effect, id).toBe('show');
    for (const id of ['layer.add', 'transform.flip_horizontal', 'timeline.add_frame', 'tilemap.add_tile']) expect(MANIFEST[id]?.effect, id).toBe('edit');
  });
});

describe('selection runs', () => {
  it('round trips a mask as row runs', () => {
    const runs: [number, number, number][] = [[0, 0, 1], [2, 1, 3], [2, 5, 5]];
    const mask = maskOfRuns(runs, { width: 8, height: 4 });
    expect(runsOfMask(mask)).toEqual(runs);
    expect(selectionReply(mask)).toMatchObject({ empty: false, pixels: 6, bounds: { x: 0, y: 0, width: 6, height: 3 } });
  });

  it('clips runs that leave the sprite and reports an empty selection', () => {
    expect(runsOfMask(maskOfRuns([[9, 0, 3], [1, -4, 1]], { width: 4, height: 4 }))).toEqual([[1, 0, 1]]);
    expect(selectionReply(null)).toEqual({ empty: true, bounds: null, pixels: 0, runs: null });
  });
});
