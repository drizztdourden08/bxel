/* @layer renderer-app @kind test */
import type { Animation, Artwork } from '@bxel/document';
import { checkToolMode } from '@bxel/mcp';
import type { ToolName } from '@bxel/mcp';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { writeProjectAssets } from '../workspace/workspace-harness';
import { animatedArtwork } from './animation-fixture';
import { ROOT } from './project-harness';
import { fieldOf, rowsOf, toolRig } from './project-tool-rig';
import type { ToolRig } from './project-tool-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

let current: ToolRig;
let artwork: Artwork;
let paths: ReadonlyMap<string, string>;

const water = (): Animation => {
  const found = artwork.animations.find((animation) => animation.name === 'water');
  if (!found) throw new Error('no water');
  return found;
};

const documentOf = (): string => {
  const workspace = Object.values(useWorkspaceStore.getState().workspaces)[0];
  if (!workspace) throw new Error('the project workspace did not open');
  return workspace.documentId;
};

const listing = (extra: object = {}) => ({ projectId: current.projectId, kinds: ['sprite', 'animation', 'sheet', 'palette', 'tileset', 'tilemap'], offset: 0, limit: 200, ...extra });

const revisionOf = (): number => current.rig.kit.host.view(documentOf() as never)?.state.revision ?? 0;

const addFrame = (baseRevision = revisionOf()) => ({
  documentId: documentOf(),
  baseRevision,
  label: 'Add a frame',
  steps: [{ name: 'animation.frame.add', targets: null, options: { animation: water().id, source: { kind: 'empty', count: 1 }, durationMs: 50 } }],
});

beforeEach(async () => {
  artwork = animatedArtwork();
  current = await toolRig({
    seed: (disk) => {
      paths = writeProjectAssets(disk, ROOT, artwork);
    },
  });
});

describe('the animation kind in list_assets and get_document', () => {
  it('lists the animation with the tileset that plays it, and leaves its frame sprites out', async () => {
    const assets = rowsOf(await current.run('list_assets', listing(), current.grants('read')), 'assets');
    const animation = assets.find((asset) => asset.kind === 'animation');
    expect(animation).toMatchObject({ name: 'water', id: water().id, opened: true, dirty: false });
    expect(animation?.usedBy).toEqual([artwork.tilesets[0]?.id]);
    expect(assets.filter((asset) => asset.kind === 'sprite')).toHaveLength(artwork.sprites.filter((sprite) => sprite.role === 'sprite').length);
    expect(assets.some((asset) => String(asset.name).includes('frame'))).toBe(false);
    const users = rowsOf(await current.run('list_assets', listing({ kinds: ['tileset'], usedBy: water().id }), current.grants('read')), 'assets');
    expect(users.map((asset) => asset.kind)).toEqual(['tileset']);
  });

  it('names the animations in get_document and keeps owned frame sprites out of the sprites', async () => {
    const read = await current.run('get_document', { documentId: documentOf(), spriteOffset: 0, spriteLimit: 100 }, current.grants('read'));
    expect(rowsOf(read, 'animations')).toEqual([{ animationId: water().id, name: 'water', width: 8, height: 8, frames: 2, tags: 1 }]);
    const owned = new Set(artwork.sprites.filter((sprite) => sprite.role === 'frame').map((sprite) => sprite.id));
    expect(owned.size).toBe(2);
    expect(rowsOf(read, 'sprites').some((sprite) => owned.has(sprite.spriteId as never))).toBe(false);
  });

  it('shows the animation a tile plays in list_map_layers', async () => {
    const listed = await current.run('list_map_layers', { documentId: documentOf(), includeTiles: true }, current.grants('read'));
    const tiles = rowsOf(listed, 'tilesets')[0]?.tiles as readonly Record<string, unknown>[];
    expect(tiles[0]?.animation).toEqual({ animationId: water().id, tagId: null, start: 'together' });
  });
});

describe('get_animation', () => {
  it('reads the frames, the tags and what plays the animation', async () => {
    const read = await current.run('get_animation', { documentId: documentOf(), animationId: water().id }, current.grants('read'));
    expect(read).toMatchObject({ ok: true, name: 'water', width: 8, height: 8, cycleMs: 200, directions: 'none' });
    const frames = rowsOf(read, 'frames');
    expect(frames.map((frame) => [frame.index, frame.owned, frame.durationMs])).toEqual([[0, true, 100], [1, true, 100]]);
    expect(new Set(frames.map((frame) => frame.spriteId)).size).toBe(2);
    expect(rowsOf(read, 'tags')).toMatchObject([{ kind: 'span', name: 'flow', from: 0, to: 1 }]);
    expect(fieldOf(read, 'usedBy')).toEqual({ sheets: [], tilesets: [{ tilesetId: artwork.tilesets[0]?.id, keys: [1] }] });
  });

  it('does not find an animation that is not there, and is hidden from a project without a grant', async () => {
    const missing = await current.run('get_animation', { documentId: documentOf(), animationId: 'anm_4k9m2q7x1v8c' }, current.grants('read'));
    expect(missing).toMatchObject({ ok: false, error: { code: 'TARGET_NOT_FOUND' } });
    const ungranted = await current.run('get_animation', { documentId: documentOf(), animationId: water().id }, []);
    expect(ungranted).toMatchObject({ ok: false, error: { code: 'DOCUMENT_NOT_FOUND' } });
  });
});

describe('render_preview of an animation', () => {
  const render = (target: object, extra: object = {}) => current.run('render_preview', { documentId: documentOf(), target, scale: 2, ...extra }, current.grants('read'));

  it('draws one frame on the animation canvas', async () => {
    const [first, second] = water().frames;
    const one = await render({ animationId: water().id, frameId: first?.id });
    const two = await render({ animationId: water().id, frameId: second?.id });
    expect(one).toMatchObject({ ok: true, width: 16, height: 16, scale: 2 });
    expect(String(fieldOf(one, 'uri'))).toContain(`/animation/${water().id}/frame/${first?.id}/preview.png`);
    expect(fieldOf(one, 'indexHash')).not.toBe(fieldOf(two, 'indexHash'));
  });

  it('draws the whole animation, or one tag, as a strip in play order', async () => {
    const tag = water().tags[0];
    expect(await render({ animationId: water().id })).toMatchObject({ ok: true, width: 32, height: 16 });
    expect(await render({ animationId: water().id, tagId: tag?.id })).toMatchObject({ ok: true, width: 32, height: 16 });
  });

  it('answers a missing frame or tag as not found', async () => {
    const frame = await render({ animationId: water().id, frameId: 'afr_4k9m2q7x1v8c' });
    expect(frame).toMatchObject({ ok: false, error: { code: 'TARGET_NOT_FOUND' } });
    const tag = await render({ animationId: water().id, tagId: 'tag_4k9m2q7x1v8c' });
    expect(tag).toMatchObject({ ok: false, error: { code: 'TARGET_NOT_FOUND' } });
  });
});

describe('editing an animation in an edit granted project', () => {
  it('adds a frame, renders it, and saves only the animation', async () => {
    const edited = await current.run('apply_edits', addFrame(), current.grants('edit'));
    expect(edited).toMatchObject({ ok: true });
    const read = await current.run('get_animation', { documentId: documentOf(), animationId: water().id }, current.grants('read'));
    expect(rowsOf(read, 'frames')).toHaveLength(3);
    expect(fieldOf(read, 'cycleMs')).toBe(250);
    const strip = await current.run('render_preview', { documentId: documentOf(), target: { animationId: water().id }, scale: 1 }, current.grants('read'));
    expect(strip).toMatchObject({ ok: true, width: 24, height: 8 });
    const dirty = rowsOf(await current.run('list_assets', listing(), current.grants('read')), 'assets').filter((asset) => asset.dirty === true);
    expect(dirty.map((asset) => asset.kind)).toEqual(['animation']);
    current.rig.disk.writes.length = 0;
    const saved = await current.run('save_document', { documentId: documentOf(), asset: { kind: 'animation', id: water().id }, target: 'current' }, current.grants('edit'));
    expect(saved).toMatchObject({ ok: true, asset: { kind: 'animation', id: water().id } });
    expect(current.rig.disk.writes).toEqual([paths.get(water().id)]);
  });

  it('draws a frame of an owned sprite with pixels.patch, so the strip changes', async () => {
    const before = await current.run('render_preview', { documentId: documentOf(), target: { animationId: water().id }, scale: 4 }, current.grants('read'));
    const spriteId = water().frames[0]?.spriteId;
    const pixels = Buffer.from(Uint8Array.from(Array.from({ length: 64 }, () => 3))).toString('base64');
    const patch = {
      documentId: documentOf(),
      baseRevision: revisionOf(),
      label: 'Paint',
      steps: [{ name: 'pixels.patch', targets: { sprites: [spriteId], layers: { by: 'all' }, frames: { by: 'all' } }, options: { rect: { x: 0, y: 0, width: 8, height: 8 }, pixels, skipZero: false } }],
    };
    expect(await current.run('apply_edits', patch, current.grants('edit'))).toMatchObject({ ok: true });
    const after = await current.run('render_preview', { documentId: documentOf(), target: { animationId: water().id }, scale: 4 }, current.grants('read'));
    expect(fieldOf(after, 'indexHash')).not.toBe(fieldOf(before, 'indexHash'));
  });

  it('is refused for a project granted read only and for a read only session, and nothing changes', async () => {
    const revision = revisionOf();
    for (const tool of ['apply_edits', 'preview_edits'] as const) {
      const refused = await current.run(tool, addFrame(), current.grants('read'));
      expect(refused).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_GRANTED' } });
    }
    const session = await current.run('apply_edits', addFrame(), current.grants('edit'), 'read');
    expect(session).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_GRANTED' } });
    const save = await current.run('save_document', { documentId: documentOf(), asset: { kind: 'animation', id: water().id }, target: 'current' }, current.grants('read'));
    expect(save).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_GRANTED' } });
    expect(revisionOf()).toBe(revision);
    expect(current.rig.disk.writes).toEqual([]);
  });

  it('sets the animation of a tile with the tile.animation step', async () => {
    const detach = {
      documentId: documentOf(),
      baseRevision: revisionOf(),
      label: 'Detach',
      steps: [{ name: 'tile.animation', targets: null, options: { tileset: artwork.tilesets[0]?.id, key: 1, change: { kind: 'clear' } } }],
    };
    expect(await current.run('apply_edits', detach, current.grants('edit'))).toMatchObject({ ok: true });
    const listed = await current.run('list_map_layers', { documentId: documentOf(), includeTiles: true }, current.grants('read'));
    const tiles = rowsOf(listed, 'tilesets')[0]?.tiles as readonly Record<string, unknown>[];
    expect(tiles[0]?.animation).toBeNull();
  });
});

describe('create_document and export_document with an animation', () => {
  const bank = { name: 'Main', cap: 16, transparent: true, colors: [{ rgb: '#ff0000' }] };

  it('creates an animation of empty frames and names it in the answer', async () => {
    const made = await current.run('create_document', { name: 'sparkle', kind: 'animation', bank, animation: { width: 12, height: 10, frames: 3 } }, current.grants('edit'));
    expect(made).toMatchObject({ ok: true, asset: { kind: 'animation' } });
    const created = current.rig.kit.host.view(String(fieldOf(made, 'documentId')) as never)?.state.artwork.animations[0];
    expect(created).toMatchObject({ name: 'sparkle', width: 12, height: 10 });
    expect(created?.frames).toHaveLength(3);
  });

  it('keeps every animation edit tool behind an edit session', () => {
    const inputs: Partial<Record<ToolName, unknown>> = {
      create_document: { name: 'nope', kind: 'animation', bank },
      apply_edits: addFrame(),
      export_document: { documentId: documentOf(), format: 'gif', source: { animationId: water().id }, scale: 1, fileName: 'x.gif' },
      save_document: { documentId: documentOf(), asset: { kind: 'animation', id: water().id }, target: 'current' },
    };
    for (const [tool, input] of Object.entries(inputs)) {
      expect(checkToolMode(tool as ToolName, input, 'read')).toMatchObject({ error: { code: 'READ_ONLY_SESSION' } });
      expect(checkToolMode(tool as ToolName, input, 'edit')).toBeNull();
    }
    expect(checkToolMode('get_animation', { documentId: documentOf(), animationId: water().id }, 'read')).toBeNull();
  });

  it('exports an animation as a gif and a strip as a png into an edit granted project', async () => {
    const gif = await current.run('export_document', { documentId: documentOf(), format: 'gif', source: { animationId: water().id }, scale: 2, location: current.locate('exports/water.gif') }, current.grants('edit'));
    expect(gif).toMatchObject({ ok: true, files: [{ fileName: 'water.gif' }] });
    const bytes = current.rig.disk.files.get(`${ROOT}/exports/water.gif`);
    expect(Buffer.from(bytes ?? []).subarray(0, 3).toString('latin1')).toBe('GIF');
    const png = await current.run('export_document', { documentId: documentOf(), format: 'png', source: { animationId: water().id, tagId: water().tags[0]?.id }, scale: 1, location: current.locate('exports/water.png') }, current.grants('edit'));
    expect(png).toMatchObject({ ok: true, files: [{ fileName: 'water.png' }] });
    expect(current.rig.disk.files.has(`${ROOT}/exports/water.png`)).toBe(true);
  });

  it('refuses a gif of a sprite, and any export in a project granted read only', async () => {
    const sprite = artwork.sprites.find((each) => each.role === 'sprite');
    const gif = await current.run('export_document', { documentId: documentOf(), format: 'gif', source: { spriteId: sprite?.id }, scale: 1, location: current.locate('exports/x.gif') }, current.grants('edit'));
    expect(gif).toMatchObject({ ok: false, error: { code: 'INVALID_OPTION' } });
    const locked = await current.run('export_document', { documentId: documentOf(), format: 'gif', source: { animationId: water().id }, scale: 1, location: current.locate('exports/y.gif') }, current.grants('read'));
    expect(locked).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_GRANTED' } });
    expect(current.rig.disk.files.has(`${ROOT}/exports/y.gif`)).toBe(false);
  });
});
