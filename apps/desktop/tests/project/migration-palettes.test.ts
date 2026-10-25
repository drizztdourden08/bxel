/* @layer renderer-app @kind test */
import { decodePalette } from '@bxel/document/native';
import { createSwatchSetId } from '@bxel/project';
import type { SwatchSet } from '@bxel/project';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { openProject } from '../../src/project/open-project';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { bytes, legacyManifestOf, rig, ROOT, withLegacyManifest } from './project-harness';
import type { Rig } from './project-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

const warm: SwatchSet = { setId: createSwatchSetId(bytes), name: 'Warm', colors: [{ rgb: '#ff0000', name: 'Red' }] };

const OLD = `${ROOT}/Dungeon.bxelproject`;

let held: Rig;

const openOld = async (): Promise<void> => {
  withLegacyManifest(held.disk, legacyManifestOf({ swatchSets: [warm] }));
  held.disk.dirs.add(`${ROOT}/palettes`);
  held.disk.picks.folder = ROOT;
  await openProject();
};

beforeEach(() => {
  held = rig();
});

describe('updating an older project whose palette name is taken', () => {
  it('writes the swatch set under a free name and leaves the other file as it was', async () => {
    const other = new Uint8Array([9, 9, 9]);
    held.disk.files.set(`${ROOT}/palettes/Warm.bxpalette`, other);
    await openOld();
    expect(held.disk.files.get(`${ROOT}/palettes/Warm.bxpalette`)).toBe(other);
    const moved = held.disk.files.get(`${ROOT}/palettes/Warm 2.bxpalette`);
    expect(decodePalette(moved as Uint8Array).slice?.artwork.banks?.[0]?.name).toBe('Warm');
    expect(held.disk.trashed).toEqual([OLD]);
  });
});

describe('updating an older project when a palette cannot be written', () => {
  it('opens the project and keeps the older file', async () => {
    const write = held.disk.port.write;
    vi.spyOn(held.disk.port, 'write').mockImplementation((path, data, options) =>
      path.endsWith('.bxpalette') ? Promise.reject(new Error('disk full')) : write(path, data, options),
    );
    await openOld();
    expect(useProjectStore.getState().project?.manifest.name).toBe('Dungeon');
    expect(held.disk.trashed).toEqual([]);
    expect(held.disk.files.has(OLD)).toBe(true);
  });
});
