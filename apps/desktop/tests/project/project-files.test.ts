/* @layer renderer-app @kind test */
import { decodeArtwork } from '@bxel/document/native';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { grantRows } from '../../src/project/grant-rows';
import { formatSize } from '../../src/project/format-size';
import { newProjectFile } from '../../src/project/new-project-file';
import { projectMenu } from '../../src/menu/project-menu';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useFileStore } from '../../src/stores/useFileStore';
import { manifestOf, rig, ROOT } from './project-harness';
import type { Rig } from './project-harness';
import { grantOf } from './project-tool-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

let held: Rig;

beforeEach(() => {
  held = rig();
  held.disk.granted.add(ROOT.toLowerCase());
  held.disk.dirs.add(ROOT);
});

describe('a new file in the project', () => {
  it('is written into the folder, opened as a saved tab and remembered by its path', async () => {
    expect(await newProjectFile(ROOT, 'hero')).toEqual({ ok: true });
    const bytes = held.disk.files.get(`${ROOT}/hero.bxel`);
    expect(bytes).toBeInstanceOf(Uint8Array);
    const report = decodeArtwork(bytes as Uint8Array);
    expect(report.outcome).toBe('ok');
    expect(report.artwork?.name).toBe('hero');
    const [documentId] = useDocumentStore.getState().host.list();
    expect(useFileStore.getState().paths[documentId ?? '']).toBe(`${ROOT}/hero.bxel`);
    expect(useDocumentStore.getState().host.view(documentId ?? '' as never)?.clean).toBe(true);
    expect(useDocumentStore.getState().activeId).toBe(documentId);
  });

  it('keeps a .bxel suffix the owner typed', async () => {
    expect(await newProjectFile(ROOT, 'slime.bxel')).toEqual({ ok: true });
    expect(held.disk.files.has(`${ROOT}/slime.bxel`)).toBe(true);
  });

  it('refuses a name that is taken, whatever the case, and writes nothing more', async () => {
    held.disk.files.set(`${ROOT}/Hero.bxel`, new Uint8Array(1));
    const outcome = await newProjectFile(ROOT, 'hero');
    expect(outcome).toMatchObject({ ok: false });
    expect(held.disk.writes).toEqual([]);
    expect(useDocumentStore.getState().host.list()).toHaveLength(0);
  });

  it.each(['', 'a/b', 'a\\b', 'CON', '.hidden', 'x'.repeat(70)])('refuses the name "%s"', async (name) => {
    const outcome = await newProjectFile(ROOT, name);
    expect(outcome.ok).toBe(false);
    expect(held.disk.writes).toEqual([]);
  });

  it('opens nothing when the write fails', async () => {
    const outcome = await newProjectFile('C:/Elsewhere', 'hero');
    expect(outcome.ok).toBe(false);
  });
});

describe('the project rows of the assistant settings', () => {
  const recent = (name: string, rootRealPath: string, projectId = manifestOf().projectId) => ({
    projectId,
    name,
    rootRealPath,
    openedAt: '2026-10-24T10:00:00.000Z',
  });

  it('show off for a project without a grant and the stored level for one with', () => {
    const entries = [recent('Dungeon', ROOT), recent('Forest', 'C:/Art/Forest', 'prj_zzzzzzzzzzzz')];
    const rows = grantRows(entries, [grantOf('prj_zzzzzzzzzzzz', 'read', 'C:/Art/Forest')], null);
    expect(rows.map((row) => [row.name, row.access, row.open])).toEqual([
      ['Dungeon', 'off', false],
      ['Forest', 'read', false],
    ]);
    expect(rows[0]?.folders).toEqual([ROOT]);
  });
});

describe('the Project menu', () => {
  it('leads with New, Open and Open recent, and closes only an open project', () => {
    const item = projectMenu([], false, () => undefined);
    const keys = (item.children ?? []).map((child) => (child === 'separator' ? child : child.key));
    expect(keys).toEqual(['project.new', 'project.open', 'project-open-recent', 'separator', 'project.panel', 'project.settings', 'project.close']);
    const close = item.children?.at(-1);
    expect(close !== 'separator' && close?.disabled).toBe(true);
    expect(projectMenu([], true, () => undefined).children?.at(-1)).toMatchObject({ disabled: false });
  });

  it('lists recent projects by name with the folder as the description', () => {
    const opened: string[] = [];
    const entry = { projectId: manifestOf().projectId, name: 'Dungeon', rootRealPath: ROOT, openedAt: '2026-10-24T10:00:00.000Z' };
    const recentItem = projectMenu([entry], false, (root) => opened.push(root)).children?.[2];
    const first = recentItem !== 'separator' ? recentItem?.children?.[0] : undefined;
    expect(first).toMatchObject({ label: 'Dungeon', description: ROOT });
    if (first && first !== 'separator') first.onClick?.();
    expect(opened).toEqual([ROOT]);
  });
});

describe('file sizes', () => {
  it('reads in bytes, kilobytes and megabytes', () => {
    expect([0, 999, 1024, 1536, 10240, 5 * 1024 * 1024].map(formatSize)).toEqual(['0 B', '999 B', '1.0 KB', '1.5 KB', '10 KB', '5.0 MB']);
  });
});
