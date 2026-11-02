/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { repairOnLoad } from '../../src/project-health/repair-on-load';
import { useHealthStore } from '../../src/stores/useHealthStore';
import { linksIn } from '../project/links-in';
import { ROOT } from '../project/project-harness';
import { artworkOf, openSampleProject } from '../workspace/open-sample-project';
import { heldRig } from '../workspace/held-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const held = heldRig();

describe('K3 the repair by id when a project opens', { tags: ['standard'] }, () => {
  it('follows the id of a moved file, writes the new path and lists the links under Repaired', async () => {
    const { documentId, paths } = await openSampleProject(held.rig);
    const sprite = artworkOf(documentId).sprites[0];
    const from = paths.get(sprite?.id ?? '') ?? '';
    const to = `${ROOT}/sprites/hero/slime.bxsprite`;
    const { files, dirs } = held.rig.disk;
    dirs.add(to.slice(0, to.lastIndexOf('/')));
    files.set(to, files.get(from) ?? new Uint8Array());
    files.delete(from);

    await repairOnLoad();

    const store = useHealthStore.getState();
    expect(store.repaired.length).toBeGreaterThan(0);
    expect(store.repaired.every((finding) => finding.foundPath === to || finding.file === to)).toBe(true);
    expect(store.repaired.some((finding) => finding.foundPath === to)).toBe(true);
    const sheet = store.repaired.find((finding) => finding.file !== to);
    expect(linksIn(held.rig.disk, sheet?.file ?? '')).toContain(to);
    const state = store.state;
    if (state.status !== 'ready') throw new Error('the check did not finish');
    expect(state.report.moved).toEqual([]);
    expect(state.report.repaired.length).toBe(store.repaired.length);
  });

  it('lists nothing as repaired when no link has an old path', async () => {
    await openSampleProject(held.rig);
    await repairOnLoad();
    expect(useHealthStore.getState().repaired).toEqual([]);
  });
});
