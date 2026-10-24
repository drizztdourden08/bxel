/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { openProject } from '../../src/project/open-project';
import { packCurrentProject } from '../../src/project/pack-current-project';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { openPath } from '../../src/workspace/open-path';
import { paintSprite, sampleArtwork, writeProjectAssets } from '../workspace/workspace-harness';
import { key } from './disk-paths';
import { rig, ROOT, withManifest } from './project-harness';
import type { Rig } from './project-harness';
import { toast } from './project-mocks';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

const PACKED = 'C:/Art/Share/Dungeon.bxproject';
const OUT = 'C:/Art/Out';

let held: Rig;

const aimDialogs = (): void => {
  held.disk.granted.add(key('C:/Art/Share'));
  (held.disk.port as { saveAs: () => Promise<string | null> }).saveAs = () => Promise.resolve(PACKED);
};

const assetFiles = (root: string): Map<string, string | Uint8Array> =>
  new Map([...held.disk.files].filter(([path]) => path.startsWith(`${root}/`) && !path.endsWith('.bxproject')).map(([path, bytes]) => [path.slice(root.length), bytes]));

beforeEach(() => {
  held = rig();
});

describe('Pack project and unpack it again', () => {
  it('packs every native asset into one .bxproject and unpacks it into an identical project', async () => {
    writeProjectAssets(held.disk, ROOT, sampleArtwork());
    withManifest(held.disk);
    held.disk.picks.folder = ROOT;
    await openProject();
    aimDialogs();
    await packCurrentProject();
    expect(held.disk.files.has(PACKED)).toBe(true);
    expect(toast).toHaveBeenCalledWith(expect.stringMatching(/^Packed the project with \d+ assets/), expect.anything());

    held.disk.picks.folder = OUT;
    const outcome = await openPath(held.kit, PACKED);
    expect(outcome.kind).toBe('done');
    const root = useProjectStore.getState().project?.rootRealPath ?? '';
    expect(root).toBe(`${OUT}/Dungeon`);
    expect(assetFiles(root)).toEqual(assetFiles(ROOT));
    const workspace = Object.values(useWorkspaceStore.getState().workspaces).find((each) => each.kind === 'project');
    expect(workspace?.dirty.size).toBe(0);
    expect(workspace?.paths.size).toBe(assetFiles(ROOT).size);
  });

  it('saves unsaved work before packing so the pack holds it', async () => {
    const artwork = sampleArtwork();
    const paths = writeProjectAssets(held.disk, ROOT, artwork);
    withManifest(held.disk);
    held.disk.picks.folder = ROOT;
    await openProject();
    const workspace = Object.values(useWorkspaceStore.getState().workspaces)[0];
    const sprite = artwork.sprites[0];
    if (!workspace || !sprite) throw new Error('the project did not open');
    paintSprite(workspace.documentId, sprite.id, 2);
    const before = held.disk.files.get(paths.get(sprite.id) ?? '');
    aimDialogs();
    await packCurrentProject();
    expect(held.disk.files.get(paths.get(sprite.id) ?? '')).not.toEqual(before);
    expect(held.disk.files.has(PACKED)).toBe(true);
  });

  it('refuses a place inside the project', async () => {
    writeProjectAssets(held.disk, ROOT, sampleArtwork());
    withManifest(held.disk);
    held.disk.picks.folder = ROOT;
    await openProject();
    (held.disk.port as { saveAs: () => Promise<string | null> }).saveAs = () => Promise.resolve(`${ROOT}/packed.bxproject`);
    await packCurrentProject();
    expect(held.disk.files.has(`${ROOT}/packed.bxproject`)).toBe(false);
    expect(toast).toHaveBeenCalledWith(expect.stringContaining('outside'), expect.objectContaining({ variant: 'danger' }));
  });
});
