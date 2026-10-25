/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { grantRig, relativePath, revisionOf, spriteId } from './grant-inputs';
import type { GrantRig } from './grant-inputs';
import { holdOtherProject, OTHER } from './other-project';
import { grantOf, ROOT } from './project-tool-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

let rig: GrantRig;

const sprite = (at: number) => ({ kind: 'sprite', id: spriteId(rig, at) });

const saveTo = (asset: object, location: object, extra: object = {}) => ({
  documentId: rig.documentId,
  asset,
  target: { location, overwrite: false, moveAsset: false, ...extra },
});

const own = (at: number) => rig.current.locate(relativePath(rig, spriteId(rig, at)));

beforeEach(async () => {
  rig = await grantRig();
});

describe('save_document onto a file another asset owns', () => {
  it.each([false, true])('refuses overwrite with FILE_IN_USE when moveAsset is %s, and leaves the file alone', async (moveAsset) => {
    const path = `${ROOT}/${relativePath(rig, spriteId(rig, 0))}`;
    const before = rig.current.rig.disk.files.get(path);
    const input = saveTo(sprite(1), own(0), { overwrite: true, moveAsset });
    const refused = await rig.current.run('save_document', input, rig.current.grants('edit'));
    expect(refused).toMatchObject({ ok: false, error: { code: 'FILE_IN_USE' } });
    expect(rig.current.rig.disk.files.get(path)).toBe(before);
    expect(rig.current.rig.disk.writes).toEqual([]);
  });

  it('still lets an asset be saved over its own file', async () => {
    const input = saveTo(sprite(0), own(0), { overwrite: true, moveAsset: true });
    const saved = await rig.current.run('save_document', input, rig.current.grants('edit'));
    expect(saved).toMatchObject({ ok: true });
  });
});

const otherPlace = () => {
  const other = holdOtherProject(rig.current.rig.disk);
  const folderId = other.folders[0]?.folderId ?? '';
  const location = (path: string) => ({ projectId: other.manifest.projectId, folderId, path });
  return { grant: grantOf(other.manifest.projectId, 'edit', OTHER), location };
};

describe('save_document to a new place with moveAsset', () => {
  it('checks the grant of the project the asset comes from first', async () => {
    const place = otherPlace();
    const input = saveTo(sprite(1), place.location('moved.bxsprite'), { moveAsset: true });
    const refused = await rig.current.run('save_document', input, [...rig.current.grants('read'), place.grant]);
    expect(refused).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_GRANTED' } });
    expect(rig.current.rig.disk.files.has(`${OTHER}/moved.bxsprite`)).toBe(false);
    expect(rig.current.rig.disk.writes).toEqual([]);
  });

  it('moves the asset when both projects allow editing', async () => {
    const place = otherPlace();
    const input = saveTo(sprite(1), place.location('moved.bxsprite'), { moveAsset: true });
    const moved = await rig.current.run('save_document', input, [...rig.current.grants('edit'), place.grant]);
    expect(moved).toMatchObject({ ok: true, fileName: 'moved.bxsprite' });
    expect(rig.current.rig.disk.files.has(`${OTHER}/moved.bxsprite`)).toBe(true);
  });
});

const recolourSteps = () => {
  const bank = rig.artwork.banks[0];
  const swatch = bank?.slots.find((slot) => slot.kind !== 'transparent');
  return [
    { name: 'sprite.create', targets: null, options: { name: 'fresh', width: 8, height: 8 } },
    { name: 'swatch.update', targets: null, options: { bankId: bank?.id, swatchId: swatch?.id, rgb: '#123456' } },
  ];
};

const newestSpriteId = (): string => {
  const sprites = rig.current.rig.kit.host.view(rig.documentId as never)?.state.artwork.sprites ?? [];
  return sprites.at(-1)?.id ?? '';
};

describe('the companion files of a save to a new place', () => {
  it('writes a changed palette only where the grant allows editing', async () => {
    const edit = { documentId: rig.documentId, baseRevision: revisionOf(rig), label: 'Add', steps: recolourSteps() };
    expect(await rig.current.run('apply_edits', edit, rig.current.grants('edit'))).toMatchObject({ ok: true });
    const palette = `${ROOT}/${relativePath(rig, rig.artwork.banks[0]?.id ?? '')}`;
    const before = rig.current.rig.disk.files.get(palette);
    const place = otherPlace();
    const input = saveTo({ kind: 'sprite', id: newestSpriteId() }, place.location('fresh.bxsprite'));
    const refused = await rig.current.run('save_document', input, [...rig.current.grants('read'), place.grant]);
    expect(refused).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_GRANTED' } });
    expect(rig.current.rig.disk.files.get(palette)).toBe(before);
    expect(rig.current.rig.disk.files.has(`${OTHER}/fresh.bxsprite`)).toBe(false);
  });
});
