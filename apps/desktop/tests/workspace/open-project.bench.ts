/* @layer renderer-app @kind bench */
import { bench, describe, vi } from 'vitest';
import { openProject } from '../../src/project/open-project';
import { rig, ROOT, withManifest } from '../project/project-harness';
import { manyArtwork } from './many-artwork';
import { writeProjectAssets } from './workspace-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const HEAVY = { iterations: 8, time: 0, warmupIterations: 3, warmupTime: 0 };

const stage = (assets: number): ReadonlyMap<string, string | Uint8Array> => {
  const held = rig();
  writeProjectAssets(held.disk, ROOT, manyArtwork(assets));
  withManifest(held.disk);
  return new Map(held.disk.files);
};

const opened = async (files: ReadonlyMap<string, string | Uint8Array>): Promise<void> => {
  const held = rig();
  for (const [path, content] of files) held.disk.files.set(path, content);
  held.disk.dirs.add(ROOT);
  held.disk.picks.folder = ROOT;
  await openProject();
};

const small = stage(100);
const medium = stage(200);
const large = stage(400);

describe('opening a project', () => {
  bench('100 assets (target 50 ms)', () => opened(small), HEAVY);
  bench('200 assets (target 100 ms)', () => opened(medium), HEAVY);
  bench('400 assets (target 200 ms)', () => opened(large), HEAVY);
});
