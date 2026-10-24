/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { DocumentId } from '@bxel/document';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildRows } from '../../src/asset-list/build-rows';
import { canDuplicate } from '../../src/asset-list/can-duplicate';
import { duplicateRow } from '../../src/asset-list/duplicate-row';
import { listProjectFiles } from '../../src/asset-list/list-project-files';
import type { AssetRow } from '../../src/asset-list/asset-list.type';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { runSteps } from '../../src/transactions/run-steps';
import { rig } from '../project/project-harness';
import type { Rig } from '../project/project-harness';
import { artworkOf, openSampleProject, workspaceOf } from '../workspace/open-sample-project';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

let held: Rig;
let documentId: DocumentId;

const rowsOf = async (): Promise<readonly AssetRow[]> => {
  const project = useProjectStore.getState().project;
  if (!project) throw new Error('no project');
  const artwork = artworkOf(documentId);
  return buildRows({ workspace: workspaceOf(documentId), artwork, files: await listProjectFiles(held.disk.port, project) });
};

const rowOf = async (kind: string, name: string): Promise<AssetRow> => {
  const found = (await rowsOf()).find((each) => each.kind === kind && each.name === name);
  if (!found) throw new Error(`no ${kind} named ${name}`);
  return found;
};

const step = (name: string, options: unknown, ref?: string) => ({ name, targets: null, options, ...(ref === undefined ? {} : { ref }) });

const revision = (): number => useDocumentStore.getState().host.view(documentId)?.state.revision ?? 0;

const undoOnce = (): void => {
  const { host } = useDocumentStore.getState();
  host.undo(documentId);
};

beforeEach(async () => {
  held = rig();
  documentId = (await openSampleProject(held)).documentId;
  const made = runSteps(useDocumentStore.getState().host, documentId, 'Tiles', [
    step(COMMAND_NAME.tilesetCreate, { name: 'ground', tileWidth: 8, tileHeight: 8 }, 'ts'),
    step(COMMAND_NAME.tileAdd, { tileset: { ref: 'ts' } }),
    step(COMMAND_NAME.tilemapCreate, { name: 'level', tileset: { ref: 'ts' }, columns: 4, rows: 3 }),
  ]);
  if (!made.ok) throw new Error(made.error.message);
});

const found = <T>(value: T | undefined): T => {
  if (value === undefined) throw new Error('missing');
  return value;
};

const rowKind = (rows: readonly AssetRow[], kind: string): AssetRow => found(rows.find((each) => each.kind === kind));

describe('Duplicate for palettes, tilesets and tilemaps', () => {
  it('is offered for every loaded asset kind', async () => {
    const rows = await rowsOf();
    const offered = ['palette', 'tileset', 'tilemap'].map((kind) => canDuplicate(rowKind(rows, kind)));
    expect(offered).toEqual([true, true, true]);
  });

  it('copies a palette with new swatch ids, gives it a file in the palettes folder and undoes in one step', async () => {
    const source = found(artworkOf(documentId).banks[0]);
    const before = revision();
    duplicateRow(await rowOf('palette', source.name));
    const banks = artworkOf(documentId).banks;
    const copy = found(banks.find((bank) => bank.name === `${source.name} copy`));
    expect(copy.slots.map((slot) => slot.kind)).toEqual(source.slots.map((slot) => slot.kind));
    const sourceIds = new Set(source.slots.map((slot) => slot.id));
    expect(copy.slots.filter((slot) => sourceIds.has(slot.id))).toEqual([]);
    expect(workspaceOf(documentId).paths.get(copy.id)).toMatch(/\/palettes\/.+copy\.bxpalette$/);
    expect(workspaceOf(documentId).dirty.has(`palette:${copy.id}`)).toBe(true);
    expect(revision()).toBe(before + 1);
    undoOnce();
    expect(artworkOf(documentId).banks).toHaveLength(banks.length - 1);
  });

  it('copies a tileset with its tiles and a tilemap with its layers, each with its own file', async () => {
    duplicateRow(await rowOf('tileset', 'ground'));
    duplicateRow(await rowOf('tilemap', 'level'));
    const artwork = artworkOf(documentId);
    const tileset = found(artwork.tilesets.find((each) => each.name === 'ground copy'));
    const map = found(artwork.tilemaps.find((each) => each.name === 'level copy'));
    const paths = workspaceOf(documentId).paths;
    expect(tileset.tiles).toHaveLength(1);
    expect(map.tilesetId).toBe(found(artwork.tilesets.find((each) => each.name === 'ground')).id);
    expect(paths.get(tileset.id)).toMatch(/\.bxtiles$/);
    expect(paths.get(map.id)).toMatch(/\.bxmap$/);
    expect(paths.get(tileset.id)).not.toBe(paths.get(found(artwork.tilesets[0]).id));
  });
});
