/* @layer renderer-app @kind test */
import type { Animation } from '@bxel/document';
import { checkGrant, grantOfMode } from '@bxel/mcp';
import type { ToolName } from '@bxel/mcp';
import { describe, expect, it, vi } from 'vitest';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { openAnimatedWorld } from './animation-fixture';
import { ROOT } from './project-harness';
import { fieldOf, rowsOf } from './project-tool-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

const world = openAnimatedWorld();

const water = (): Animation => {
  const found = world().artwork.animations.find((animation) => animation.name === 'water');
  if (!found) throw new Error('no water');
  return found;
};

const documentOf = (): string => {
  const workspace = Object.values(useWorkspaceStore.getState().workspaces)[0];
  if (!workspace) throw new Error('the project workspace did not open');
  return workspace.documentId;
};

const listing = (extra: object = {}) => ({ projectId: world().rig.projectId, kinds: ['sprite', 'animation', 'sheet', 'palette', 'tileset', 'tilemap'], offset: 0, limit: 200, ...extra });

const revisionOf = (): number => world().rig.rig.kit.host.view(documentOf() as never)?.state.revision ?? 0;

const addFrame = (baseRevision = revisionOf()) => ({
  documentId: documentOf(),
  baseRevision,
  label: 'Add a frame',
  steps: [{ name: 'animation.frame.add', targets: null, options: { animation: water().id, source: { kind: 'empty', count: 1 }, durationMs: 50 } }],
});

describe('the animation kind in list_assets and get_document', () => {
  it('lists the animation with the tileset that plays it, and leaves its frame sprites out', async () => {
    const assets = rowsOf(await world().rig.run('list_assets', listing(), world().rig.grants('read')), 'assets');
    const animation = assets.find((asset) => asset.kind === 'animation');
    expect(animation).toMatchObject({ name: 'water', id: water().id, opened: true, dirty: false });
    expect(animation?.usedBy).toEqual([world().artwork.tilesets[0]?.id]);
    expect(assets.filter((asset) => asset.kind === 'sprite')).toHaveLength(world().artwork.sprites.filter((sprite) => sprite.role === 'sprite').length);
    expect(assets.some((asset) => String(asset.name).includes('frame'))).toBe(false);
    const users = rowsOf(await world().rig.run('list_assets', listing({ kinds: ['tileset'], usedBy: water().id }), world().rig.grants('read')), 'assets');
    expect(users.map((asset) => asset.kind)).toEqual(['tileset']);
  });

  it('names the animations in get_document and keeps owned frame sprites out of the sprites', async () => {
    const read = await world().rig.run('get_document', { documentId: documentOf(), spriteOffset: 0, spriteLimit: 100 }, world().rig.grants('read'));
    expect(rowsOf(read, 'animations')).toEqual([{ animationId: water().id, name: 'water', width: 8, height: 8, frames: 2, tags: 1 }]);
    const owned = new Set(world().artwork.sprites.filter((sprite) => sprite.role === 'frame').map((sprite) => sprite.id));
    expect(owned.size).toBe(2);
    expect(rowsOf(read, 'sprites').some((sprite) => owned.has(sprite.spriteId as never))).toBe(false);
  });

  it('shows the animation a tile plays in list_map_layers', async () => {
    const listed = await world().rig.run('list_map_layers', { documentId: documentOf(), includeTiles: true }, world().rig.grants('read'));
    const tiles = rowsOf(listed, 'tilesets')[0]?.tiles as readonly Record<string, unknown>[];
    expect(tiles[0]?.animation).toEqual({ animationId: water().id, tagId: null, start: 'together' });
  });
});

describe('get_animation', () => {
  it('reads the frames, the tags and what plays the animation', async () => {
    const read = await world().rig.run('get_animation', { documentId: documentOf(), animationId: water().id }, world().rig.grants('read'));
    expect(read).toMatchObject({ ok: true, name: 'water', width: 8, height: 8, cycleMs: 200, directions: 'none' });
    const frames = rowsOf(read, 'frames');
    expect(frames.map((frame) => [frame.index, frame.owned, frame.durationMs])).toEqual([[0, true, 100], [1, true, 100]]);
    expect(new Set(frames.map((frame) => frame.spriteId)).size).toBe(2);
    expect(rowsOf(read, 'tags')).toMatchObject([{ kind: 'span', name: 'flow', from: 0, to: 1 }]);
    expect(fieldOf(read, 'usedBy')).toEqual({ sheets: [], tilesets: [{ tilesetId: world().artwork.tilesets[0]?.id, keys: [1] }] });
  });

  it('does not find an animation that is not there, and is hidden from a project without a grant', async () => {
    const missing = await world().rig.run('get_animation', { documentId: documentOf(), animationId: 'anm_4k9m2q7x1v8c' }, world().rig.grants('read'));
    expect(missing).toMatchObject({ ok: false, error: { code: 'TARGET_NOT_FOUND' } });
    const ungranted = await world().rig.run('get_animation', { documentId: documentOf(), animationId: water().id }, []);
    expect(ungranted).toMatchObject({ ok: false, error: { code: 'DOCUMENT_NOT_FOUND' } });
  });
});

describe('render_preview of an animation', () => {
  const render = (target: object, extra: object = {}) => world().rig.run('render_preview', { documentId: documentOf(), target, scale: 2, ...extra }, world().rig.grants('read'));

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
    const edited = await world().rig.run('apply_edits', addFrame(), world().rig.grants('edit'));
    expect(edited).toMatchObject({ ok: true });
    const read = await world().rig.run('get_animation', { documentId: documentOf(), animationId: water().id }, world().rig.grants('read'));
    expect(rowsOf(read, 'frames')).toHaveLength(3);
    expect(fieldOf(read, 'cycleMs')).toBe(250);
    const strip = await world().rig.run('render_preview', { documentId: documentOf(), target: { animationId: water().id }, scale: 1 }, world().rig.grants('read'));
    expect(strip).toMatchObject({ ok: true, width: 24, height: 8 });
    const dirty = rowsOf(await world().rig.run('list_assets', listing(), world().rig.grants('read')), 'assets').filter((asset) => asset.dirty === true);
    expect(dirty.map((asset) => asset.kind)).toEqual(['animation']);
    world().rig.rig.disk.writes.length = 0;
    const saved = await world().rig.run('save_document', { documentId: documentOf(), asset: { kind: 'animation', id: water().id }, target: 'current' }, world().rig.grants('edit'));
    expect(saved).toMatchObject({ ok: true, asset: { kind: 'animation', id: water().id } });
    expect(world().rig.rig.disk.writes).toEqual([world().paths.get(water().id)]);
  });

  it('draws a frame of an owned sprite with pixels.patch, so the strip changes', async () => {
    const before = await world().rig.run('render_preview', { documentId: documentOf(), target: { animationId: water().id }, scale: 4 }, world().rig.grants('read'));
    const spriteId = water().frames[0]?.spriteId;
    const pixels = Buffer.from(Uint8Array.from(Array.from({ length: 64 }, () => 3))).toString('base64');
    const patch = {
      documentId: documentOf(),
      baseRevision: revisionOf(),
      label: 'Paint',
      steps: [{ name: 'pixels.patch', targets: { sprites: [spriteId], layers: { by: 'all' }, frames: { by: 'all' } }, options: { rect: { x: 0, y: 0, width: 8, height: 8 }, pixels, skipZero: false } }],
    };
    expect(await world().rig.run('apply_edits', patch, world().rig.grants('edit'))).toMatchObject({ ok: true });
    const after = await world().rig.run('render_preview', { documentId: documentOf(), target: { animationId: water().id }, scale: 4 }, world().rig.grants('read'));
    expect(fieldOf(after, 'indexHash')).not.toBe(fieldOf(before, 'indexHash'));
  });

  it('is refused for a project granted read only and for a read only session, and nothing changes', async () => {
    const revision = revisionOf();
    for (const tool of ['apply_edits', 'preview_edits'] as const) {
      const refused = await world().rig.run(tool, addFrame(), world().rig.grants('read'));
      expect(refused).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_GRANTED' } });
    }
    const session = await world().rig.run('apply_edits', addFrame(), world().rig.grants('edit'), 'read');
    expect(session).toMatchObject({ ok: false, error: { code: 'READ_LEVEL' } });
    const save = await world().rig.run('save_document', { documentId: documentOf(), asset: { kind: 'animation', id: water().id }, target: 'current' }, world().rig.grants('read'));
    expect(save).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_GRANTED' } });
    expect(revisionOf()).toBe(revision);
    expect(world().rig.rig.disk.writes).toEqual([]);
  });

  it('sets the animation of a tile with the tile.animation step', async () => {
    const detach = {
      documentId: documentOf(),
      baseRevision: revisionOf(),
      label: 'Detach',
      steps: [{ name: 'tile.animation', targets: null, options: { tileset: world().artwork.tilesets[0]?.id, key: 1, change: { kind: 'clear' } } }],
    };
    expect(await world().rig.run('apply_edits', detach, world().rig.grants('edit'))).toMatchObject({ ok: true });
    const listed = await world().rig.run('list_map_layers', { documentId: documentOf(), includeTiles: true }, world().rig.grants('read'));
    const tiles = rowsOf(listed, 'tilesets')[0]?.tiles as readonly Record<string, unknown>[];
    expect(tiles[0]?.animation).toBeNull();
  });
});

describe('create_document and export_document with an animation', () => {
  const bank = { name: 'Main', cap: 16, transparent: true, colors: [{ rgb: '#ff0000' }] };

  it('creates an animation of empty frames and names it in the answer', async () => {
    const made = await world().rig.run('create_document', { name: 'sparkle', kind: 'animation', bank, animation: { width: 12, height: 10, frames: 3 } }, world().rig.grants('edit'));
    expect(made).toMatchObject({ ok: true, asset: { kind: 'animation' } });
    const created = world().rig.rig.kit.host.view(String(fieldOf(made, 'documentId')) as never)?.state.artwork.animations[0];
    expect(created).toMatchObject({ name: 'sparkle', width: 12, height: 10 });
    expect(created?.frames).toHaveLength(3);
  });

  it('keeps every animation edit tool behind an edit grant', () => {
    const inputs: Partial<Record<ToolName, unknown>> = {
      create_document: { name: 'nope', kind: 'animation', bank },
      apply_edits: addFrame(),
      export_document: { documentId: documentOf(), format: 'gif', source: { animationId: water().id }, scale: 1, fileName: 'x.gif' },
      save_document: { documentId: documentOf(), asset: { kind: 'animation', id: water().id }, target: 'current' },
    };
    for (const [tool, input] of Object.entries(inputs)) {
      expect(checkGrant(tool as ToolName, input, grantOfMode('read'))).toMatchObject({ error: { code: 'READ_LEVEL' } });
      expect(checkGrant(tool as ToolName, input, grantOfMode('edit'))).toBeNull();
    }
    expect(checkGrant('get_animation', { documentId: documentOf(), animationId: water().id }, grantOfMode('read'))).toBeNull();
  });

  it('exports an animation as a gif and a strip as a png into an edit granted project', async () => {
    const gif = await world().rig.run('export_document', { documentId: documentOf(), format: 'gif', source: { animationId: water().id }, scale: 2, location: world().rig.locate('exports/water.gif') }, world().rig.grants('edit'));
    expect(gif).toMatchObject({ ok: true, files: [{ fileName: 'water.gif' }] });
    const bytes = world().rig.rig.disk.files.get(`${ROOT}/exports/water.gif`);
    expect(Buffer.from(bytes ?? []).subarray(0, 3).toString('latin1')).toBe('GIF');
    const png = await world().rig.run('export_document', { documentId: documentOf(), format: 'png', source: { animationId: water().id, tagId: water().tags[0]?.id }, scale: 1, location: world().rig.locate('exports/water.png') }, world().rig.grants('edit'));
    expect(png).toMatchObject({ ok: true, files: [{ fileName: 'water.png' }] });
    expect(world().rig.rig.disk.files.has(`${ROOT}/exports/water.png`)).toBe(true);
  });

  it('refuses a gif of a sprite, and any export in a project granted read only', async () => {
    const sprite = world().artwork.sprites.find((each) => each.role === 'sprite');
    const gif = await world().rig.run('export_document', { documentId: documentOf(), format: 'gif', source: { spriteId: sprite?.id }, scale: 1, location: world().rig.locate('exports/x.gif') }, world().rig.grants('edit'));
    expect(gif).toMatchObject({ ok: false, error: { code: 'INVALID_OPTION' } });
    const locked = await world().rig.run('export_document', { documentId: documentOf(), format: 'gif', source: { animationId: water().id }, scale: 1, location: world().rig.locate('exports/y.gif') }, world().rig.grants('read'));
    expect(locked).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_GRANTED' } });
    expect(world().rig.rig.disk.files.has(`${ROOT}/exports/y.gif`)).toBe(false);
  });
});
