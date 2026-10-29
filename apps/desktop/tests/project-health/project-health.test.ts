/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { repairLinks } from '../../src/project-health/repair-links';
import { scanHealth } from '../../src/project-health/scan-health';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { saveTab } from '../../src/workspace/save-tab';
import { tabOf } from '../../src/workspace/tab-of';
import { linksIn } from '../project/links-in';
import { ROOT } from '../project/project-harness';
import { heldRig } from '../workspace/held-rig';
import { artworkOf, openSampleProject } from '../workspace/open-sample-project';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const held = heldRig();

type Opened = { readonly spritePath: string; readonly sheetPaths: readonly string[]; readonly palettePath: string; readonly spriteId: string };

const open = async (): Promise<Opened> => {
  const { documentId, paths } = await openSampleProject(held.rig);
  const artwork = artworkOf(documentId);
  const sprite = artwork.sprites[0];
  const bank = artwork.banks[0];
  if (!sprite || !bank) throw new Error('the sample has a sprite and a palette');
  return {
    spritePath: paths.get(sprite.id) ?? '',
    sheetPaths: artwork.sheets.map((sheet) => paths.get(sheet.id) ?? ''),
    palettePath: paths.get(bank.id) ?? '',
    spriteId: sprite.id,
  };
};

const openedSprite = () => {
  const documentId = Object.values(useWorkspaceStore.getState().workspaces)[0]?.documentId;
  const sprite = documentId === undefined ? undefined : artworkOf(documentId).sprites[0];
  if (documentId === undefined || sprite === undefined) throw new Error('no open sprite');
  return { documentId, key: { kind: 'sprite', id: sprite.id } as const };
};

const scan = async () => {
  const found = await scanHealth();
  if (!found) throw new Error('no project to check');
  return found;
};

const linksOf = (path: string): readonly string[] => linksIn(held.rig.disk, path);

const moveOnDisk = (from: string, to: string): void => {
  const { files, dirs } = held.rig.disk;
  dirs.add(to.slice(0, to.lastIndexOf('/')));
  files.set(to, files.get(from) ?? new Uint8Array());
  files.delete(from);
};

describe('the link index and the health checks', () => {
  it('finds nothing wrong in a project whose links all lead to their files', async () => {
    await open();
    const { report, index } = await scan();
    expect(report.total).toBe(0);
    expect(index.links.length).toBeGreaterThan(0);
    expect(index.links.every((link) => link.state === 'ok')).toBe(true);
  });

  it('knows which file links to which', async () => {
    const { spritePath, sheetPaths, palettePath } = await open();
    const { index } = await scan();
    const targets = (path: string) => index.links.filter((link) => link.from.path === path).map((link) => link.found?.path);
    for (const sheet of sheetPaths) expect(targets(sheet)).toContain(spritePath);
    expect(targets(spritePath)).toContain(palettePath);
  });

  it('lists a file moved in Explorer as a moved link, and Find by id puts the new path in the files that link to it', async () => {
    const { spritePath, sheetPaths } = await open();
    const elsewhere = `${ROOT}/sprites/hero/slime.bxsprite`;
    moveOnDisk(spritePath, elsewhere);
    const { report, index } = await scan();
    expect(report.moved.map((finding) => finding.file).sort()).toEqual([...sheetPaths, elsewhere].sort());
    expect(report.moved.filter((finding) => finding.file !== elsewhere).every((finding) => finding.foundPath === elsewhere)).toBe(true);
    expect(report.broken).toEqual([]);

    const outcome = await repairLinks(held.rig.disk.port, index, report.moved.map((finding) => ({ file: finding.file, linkId: finding.linkId, by: 'id' as const })));
    expect(outcome.fixed).toBe(sheetPaths.length + 1);
    for (const sheet of sheetPaths) expect(linksOf(sheet)).toContain(elsewhere);
    expect((await scan()).report.total).toBe(0);
  });

  it('lists a missing file as a broken link and removes the link on request', async () => {
    const { spritePath, palettePath } = await open();
    held.rig.disk.files.delete(palettePath);
    const { report, index } = await scan();
    expect(report.broken.map((finding) => finding.file)).toContain(spritePath);
    expect(report.broken[0]?.targetKind).toBe('palette');
    expect(report.broken[0]?.state).toBe('missing');
    const finding = report.broken.find((each) => each.file === spritePath);
    const outcome = await repairLinks(held.rig.disk.port, index, [{ file: finding?.file ?? '', linkId: finding?.linkId ?? '', by: 'remove' }]);
    expect(outcome.fixed).toBe(1);
    expect(linksOf(spritePath)).toEqual([]);
    expect((await scan()).report.broken.map((each) => each.file)).not.toContain(spritePath);
  });

});

describe('the repairs on the files and on the open project', () => {
  it('forgets the missing target in the open project, so a later save does not write the link back', async () => {
    const { spritePath, palettePath } = await open();
    const { documentId, key } = openedSprite();
    held.rig.disk.files.delete(palettePath);
    const { report, index } = await scan();
    const finding = report.broken.find((each) => each.file === spritePath);
    const outcome = await repairLinks(held.rig.disk.port, index, [{ file: spritePath, linkId: finding?.linkId ?? '', by: 'remove' }]);
    expect(outcome.fixed).toBe(1);
    expect(linksOf(spritePath)).toEqual([]);
    const saved = await saveTab(held.rig.kit, tabOf(documentId, key), false);
    expect(saved.kind).toBe('done');
    expect(linksOf(spritePath)).toEqual([]);
  });

  it('refuses a fix that names a link or a file the project does not have, and a path that holds another asset', async () => {
    const { spritePath, sheetPaths, palettePath } = await open();
    const { index } = await scan();
    const link = index.links.find((each) => each.from.path === sheetPaths[0]);
    const outcome = await repairLinks(held.rig.disk.port, index, [
      { file: spritePath, linkId: 'spr_nothere', by: 'remove' },
      { file: 'C:/elsewhere/other.bxsprite', linkId: 'x', by: 'remove' },
      { file: sheetPaths[0] ?? '', linkId: link?.linkId ?? '', by: 'path', to: palettePath },
      { file: sheetPaths[0] ?? '', linkId: link?.linkId ?? '', by: 'path' },
    ]);
    expect(outcome.fixed).toBe(0);
    expect(outcome.skipped.map((each) => each.reason)).toEqual([
      expect.stringContaining('has no link'),
      expect.stringContaining('not a file of this project'),
      expect.stringContaining('another asset'),
      expect.stringContaining('Give the path'),
    ]);
  });

});

describe('the health checks on the files themselves', () => {
  it('lists two files with the same asset id', async () => {
    const { spritePath } = await open();
    held.rig.disk.files.set(`${ROOT}/sprites/slime copy.bxsprite`, held.rig.disk.files.get(spritePath) ?? new Uint8Array());
    const { report } = await scan();
    expect(report.duplicates).toHaveLength(1);
    expect(report.duplicates[0]?.paths).toHaveLength(2);
  });

  it('lists a file that sits in the folder of another kind', async () => {
    const { spritePath } = await open();
    const stray = `${ROOT}/palettes/slime.bxsprite`;
    moveOnDisk(spritePath, stray);
    const { report } = await scan();
    expect(report.misplaced.map((finding) => finding.path)).toEqual([stray]);
    expect(report.misplaced[0]?.folder).toBe(`${ROOT}/sprites`);
  });

  it('calls a file unused until it is pinned, collected or the cover', async () => {
    const { sheetPaths, spriteId } = await open();
    for (const sheet of sheetPaths) held.rig.disk.files.delete(sheet);
    expect((await scan()).report.unused.map((finding) => finding.name)).toContain('slime');
    const project = useProjectStore.getState().project;
    if (!project) throw new Error('no project');
    useProjectStore.getState().update({ ...project.manifest, organise: { tags: {}, collections: [], smart: [], pinned: [spriteId] } });
    expect((await scan()).report.unused.map((finding) => finding.name)).not.toContain('slime');
  });
});
