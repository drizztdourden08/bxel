/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { DocumentId } from '@bxel/document';
import { decodeTilemap, decodeTileset } from '@bxel/document/native';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { runSteps } from '../../src/transactions/run-steps';
import { saveActiveAsset } from '../../src/workspace/save-active-asset';
import { tabOf } from '../../src/workspace/tab-of';
import { rig } from '../project/project-harness';
import type { Rig } from '../project/project-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const DIR = 'C:/Art/Maps';

let held: Rig;

const mapDocument = (): { documentId: DocumentId; tilemapId: string } => {
  const { host } = useDocumentStore.getState();
  const documentId = createDefaultArtwork(host);
  const made = runSteps(host, documentId, 'Map', [
    { name: COMMAND_NAME.tilesetCreate, targets: null, options: { name: 'Tileset', tileWidth: 16, tileHeight: 16 }, ref: 'set' },
    { name: COMMAND_NAME.tileAdd, targets: null, options: { tileset: { ref: 'set' } }, ref: 'tile' },
    { name: COMMAND_NAME.tilemapCreate, targets: null, options: { name: 'map', tileset: { ref: 'set' }, columns: 4, rows: 4 }, ref: 'map' },
  ]);
  if (!made.ok) throw new Error(made.error.message);
  return { documentId, tilemapId: String(made.created.map) };
};

beforeEach(() => {
  held = rig();
  held.disk.granted.add(DIR.toLowerCase());
  held.disk.dirs.add(DIR);
});

describe('saving a tilemap of a new file', () => {
  it('asks where the new tileset it needs goes, and writes both', async () => {
    const { documentId, tilemapId } = mapDocument();
    const tab = tabOf(documentId, { kind: 'tilemap', id: tilemapId });
    useWorkspaceStore.getState().addTab(tab);
    useWorkspaceStore.getState().setActiveTab(tab.id);
    vi.spyOn(held.disk.port, 'saveAs').mockResolvedValue(`${DIR}/level.bxmap`);
    const outcome = await saveActiveAsset(held.kit, true);
    expect(outcome).toMatchObject({ kind: 'done', path: `${DIR}/level.bxmap` });
    const tileset = decodeTileset(held.disk.files.get(`${DIR}/level.bxtiles`) as Uint8Array);
    expect(tileset.outcome).toBe('ok');
    const map = decodeTilemap(held.disk.files.get(`${DIR}/level.bxmap`) as Uint8Array, tileset.slice);
    expect(map.outcome).toBe('ok');
    expect(map.slice?.name).toBe('level');
  });
});
