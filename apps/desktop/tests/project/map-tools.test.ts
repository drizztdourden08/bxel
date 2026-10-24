/* @layer renderer-app @kind test */
import type { Artwork, Tilemap, Tileset } from '@bxel/document';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { writeProjectAssets } from '../workspace/workspace-harness';
import { key } from './disk-paths';
import type { Disk } from './memory-disk';
import { mapArtwork } from './map-artwork';
import { openSharedRig, SHARED, workspaceDocumentId } from './hidden-folder-rig';
import { ROOT } from './project-harness';
import { fieldOf, rowsOf } from './project-tool-rig';
import type { ToolRig } from './project-tool-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

let current: ToolRig;
let artwork: Artwork;

const named = <T extends { name: string }>(items: readonly T[], name: string): T => {
  const found = items.find((item) => item.name === name);
  if (!found) throw new Error(`no ${name}`);
  return found;
};

const level = (): Tilemap => named(artwork.tilemaps, 'level');
const vault = (): Tilemap => named(artwork.tilemaps, 'vault');
const secret = (): Tileset => named(artwork.tilesets, 'secret');

const seed = (disk: Disk): void => {
  writeProjectAssets(disk, ROOT, artwork, new Map([[secret().id, `${SHARED}/secret.bxtiles`]]));
  disk.dirs.add(SHARED);
  disk.granted.add(key(SHARED));
};

const documentId = workspaceDocumentId;

const write = (map: Tilemap, keys: number[]) => ({
  documentId: documentId(),
  baseRevision: current.rig.kit.host.view(documentId())?.state.revision ?? 1,
  label: 'Map',
  steps: [{ name: 'map.write', targets: null, options: { tilemap: map.id, layer: { by: 'name', name: 'Layer 1' }, rect: { x: 1, y: 1, width: 2, height: 1 }, keys } }],
});

const layerOf = (map: Tilemap) => ({ documentId: documentId(), tilemapId: map.id, layerId: map.layers[0]?.id ?? '', rect: { x: 0, y: 0, width: 4, height: 2 } });

beforeEach(async () => {
  artwork = mapArtwork();
  current = await openSharedRig(seed);
});

describe('list_map_layers', () => {
  it('lists the maps the assistant may see with their layers, and leaves out a map whose tileset is hidden', async () => {
    const listed = await current.run('list_map_layers', { documentId: documentId(), includeTiles: true }, current.grants('read'));
    expect(rowsOf(listed, 'tilemaps').map((map) => map.name)).toEqual(['level']);
    expect(rowsOf(listed, 'tilemaps')[0]).toMatchObject({ columns: 4, rows: 3, orientation: 'orthogonal' });
    const sets = rowsOf(listed, 'tilesets');
    expect(sets.map((set) => set.name)).toEqual(['ground']);
    expect(sets[0]?.tiles).toHaveLength(2);
  });

  it('asks for one map by id, and does not find a hidden one', async () => {
    const seen = await current.run('list_map_layers', { documentId: documentId(), tilemapId: level().id, includeTiles: false }, current.grants('read'));
    expect(rowsOf(seen, 'tilemaps')).toHaveLength(1);
    const hidden = await current.run('list_map_layers', { documentId: documentId(), tilemapId: vault().id, includeTiles: false }, current.grants('read'));
    expect(rowsOf(hidden, 'tilemaps')).toEqual([]);
    expect(rowsOf(hidden, 'tilesets')).toEqual([]);
  });
});

describe('read_map_cells and map.write', () => {
  it('writes a rectangle through apply_edits and reads it back', async () => {
    const applied = await current.run('apply_edits', write(level(), [1, 2]), current.grants('edit'));
    expect(applied).toMatchObject({ ok: true });
    const read = await current.run('read_map_cells', layerOf(level()), current.grants('read'));
    expect(fieldOf(read, 'keys')).toEqual([0, 0, 0, 0, 0, 1, 2, 0]);
    expect(fieldOf(read, 'flags')).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('refuses a rectangle outside the map', async () => {
    const outside = { ...layerOf(level()), rect: { x: 3, y: 2, width: 2, height: 2 } };
    expect(await current.run('read_map_cells', outside, current.grants('read'))).toMatchObject({ ok: false, error: { code: 'OUT_OF_BOUNDS' } });
  });

  it('does not read or edit a map whose tileset sits in a folder the assistant may not see', async () => {
    expect(await current.run('read_map_cells', layerOf(vault()), current.grants('read'))).toMatchObject({ ok: false, error: { code: 'TARGET_NOT_FOUND' } });
    const before = current.rig.kit.host.view(documentId())?.state.revision;
    const refused = await current.run('apply_edits', write(vault(), [1, 2]), current.grants('edit'));
    expect(refused).toMatchObject({ ok: false, error: { code: 'TARGET_NOT_FOUND' } });
    expect(current.rig.kit.host.view(documentId())?.state.revision).toBe(before);
  });
});
