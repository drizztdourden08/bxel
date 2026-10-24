/* @layer renderer-app @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { openProject } from '../../src/project/open-project';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { storedTabsOf } from '../../src/workspace/stored-tabs-of';
import { tabOf } from '../../src/workspace/tab-of';
import { watchProjectTabs } from '../../src/workspace/watch-project-tabs';
import { manifestOf, rig, ROOT, withManifest } from '../project/project-harness';
import type { Rig } from '../project/project-harness';
import { sampleArtwork, writeProjectAssets } from './workspace-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

let held: Rig;

const projectId = manifestOf().projectId;

const prepare = (): ReadonlyMap<string, string> => {
  const paths = writeProjectAssets(held.disk, ROOT, sampleArtwork());
  withManifest(held.disk);
  held.disk.picks.folder = ROOT;
  return paths;
};

const workspace = () => {
  const found = Object.values(useWorkspaceStore.getState().workspaces)[0];
  if (!found) throw new Error('the project workspace did not open');
  return found;
};

beforeEach(() => {
  held = rig();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('the tabs of a project', () => {
  it('reopens the tabs the project had open, in order, on the tab that was active', async () => {
    const paths = prepare();
    const files = [...paths.values()].filter((path) => path.endsWith('.bxsheet')).sort();
    held.values.projectTabs = { [projectId]: { open: files, active: files[1] ?? null } };
    await openProject();
    const stored = storedTabsOf();
    expect(stored?.open).toEqual(files);
    expect(stored?.active).toBe(files[1]);
  });

  it('opens the usual first tab when nothing was stored or the stored files are gone', async () => {
    prepare();
    held.values.projectTabs = { [projectId]: { open: [`${ROOT}/sprites/gone.bxsprite`], active: null } };
    await openProject();
    expect(storedTabsOf()?.open).toHaveLength(1);
  });

  it('remembers the open tabs in the app settings, not in the project file', async () => {
    vi.useFakeTimers();
    const paths = prepare();
    const stop = watchProjectTabs();
    await openProject();
    const sheet = [...paths].find(([, path]) => path.endsWith('walk.bxsheet'));
    useWorkspaceStore.getState().addTab(tabOf(workspace().documentId, { kind: 'sheet', id: sheet?.[0] ?? '' }));
    vi.advanceTimersByTime(1000);
    stop();
    expect(held.values.projectTabs[projectId]?.open).toContain(sheet?.[1]);
    expect([...held.disk.files.keys()].filter((path) => path.endsWith('.bxproject'))).toHaveLength(1);
  });
});
