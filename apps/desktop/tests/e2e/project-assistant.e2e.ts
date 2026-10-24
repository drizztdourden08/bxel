/* @layer renderer-app @kind test */
import { mkdtemp, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { ProjectDocument } from '@bxel/project';
import { describe, expect, test } from 'vitest';
import { addProjectFileInUi } from './support/add-project-file-in-ui';
import { callMcp } from './support/call-mcp';
import { createProjectInUi } from './support/create-project-in-ui';
import { POLL_MS } from './support/e2e.constants';
import { linkFolderInUi, unlinkFolderInUi } from './support/link-folder-in-ui';
import { openProjectRig } from './support/open-project-rig';
import { projectOnDisk } from './support/project-on-disk';
import { readSaved } from './support/read-saved';
import { exportIntoProject, heroDocument, locationIn, saveIntoProject } from './support/project-writes';
import { createProjectFolderInUi, listed, renameProjectEntryInUi, trashProjectEntryInUi } from './support/project-entry-ui';
import type { AccessChoice, ProjectRig } from './support/project-rig.type';
import { runMenu } from './support/run-menu';
import { setProjectAccessInUi } from './support/set-project-access-in-ui';
import { showPanelView } from './support/show-folder-view';
import { answerDialogs } from './support/answer-dialogs';
import { useRig } from './support/use-rig';
import { waitText } from './support/wait-text';

const NAME = 'Dungeon';

const ROLE_FOLDERS = ['exports', 'palettes', 'sheets', 'sprites', 'tilemaps'];

const manifestOnDisk = ({ projectDir }: ProjectRig): Promise<ProjectDocument> => projectOnDisk(projectDir, NAME);

const grant = async (rig: ProjectRig, choice: AccessChoice): Promise<void> => setProjectAccessInUi(rig.session, NAME, choice);

const places = async ({ link }: ProjectRig) => (await callMcp(link.client, 'list_places')).data as { projects: { projectId: string; name: string; access: string; folders: unknown[] }[] };

const filesOf = async (rig: ProjectRig, path?: string) => {
  const manifest = await manifestOnDisk(rig);
  const folderId = manifest.folders[0]?.folderId;
  return callMcp(rig.link.client, 'list_files', { projectId: manifest.projectId, folderId, ...(path === undefined ? {} : { path }) });
};

const created = async (rig: ProjectRig): Promise<void> => {
  await createProjectInUi(rig.session, rig.projectDir, NAME);
  const manifest = await manifestOnDisk(rig);
  expect(manifest).toMatchObject({
    name: NAME,
    assistant: { access: 'off' },
    folders: [{ path: '.', roles: { sprites: 'sprites', exports: 'exports' } }],
  });
  expect((await readdir(rig.projectDir)).sort()).toEqual([`${NAME}.bxproject`, ...ROLE_FOLDERS].sort());
  await rig.session.page.getByRole('button', { name: 'New asset' }).waitFor();
};

const filed = async (rig: ProjectRig): Promise<void> => {
  await addProjectFileInUi(rig.session, 'hero');
  const saved = readSaved(join(rig.projectDir, 'hero.bxsprite'));
  expect(saved.sprites.map((sprite) => sprite.name)).toEqual(['hero']);
  await waitText(rig.session, /hero\.bxsprite in Dungeon - Bxel/);
};

const hidden = async (rig: ProjectRig): Promise<void> => {
  expect((await places(rig)).projects).toEqual([]);
  expect((await filesOf(rig)).code).toBe('PROJECT_NOT_FOUND');
  const manifest = await manifestOnDisk(rig);
  const opened = await callMcp(rig.link.client, 'open_file', { file: { projectId: manifest.projectId, folderId: manifest.folders[0]?.folderId, path: 'hero.bxsprite' } });
  expect(opened.code).toBe('PROJECT_NOT_FOUND');
};

const browsed = async (rig: ProjectRig): Promise<void> => {
  await grant(rig, 'Read only');
  const manifest = await manifestOnDisk(rig);
  expect(manifest.assistant.access).toBe('read');
  expect((await places(rig)).projects).toMatchObject([{ projectId: manifest.projectId, name: NAME, access: 'read' }]);
  const listed = await filesOf(rig);
  expect(listed.data).toMatchObject({
    ok: true,
    path: '',
    total: 6,
    entries: [...ROLE_FOLDERS.map((name) => ({ name, kind: 'folder' })), { name: 'hero.bxsprite', kind: 'bxel' }],
  });
  const entries = listed.data.entries as { name: string; documentId: string | null }[];
  expect(entries.find((entry) => entry.name === 'hero.bxsprite')?.documentId).toMatch(/^doc_/);
};

const opened = async (rig: ProjectRig): Promise<void> => {
  const manifest = await manifestOnDisk(rig);
  const file = { projectId: manifest.projectId, folderId: manifest.folders[0]?.folderId, path: 'hero.bxsprite' };
  const already = await callMcp(rig.link.client, 'open_file', { file });
  expect(already.data).toMatchObject({ ok: true, alreadyOpen: true, fileName: 'hero.bxsprite' });
  const documentId = String(already.data.documentId);
  expect((await callMcp(rig.link.client, 'close_document', { documentId })).data).toMatchObject({ ok: true, closed: true });
  const again = await callMcp(rig.link.client, 'open_file', { file });
  expect(again.data).toMatchObject({ ok: true, alreadyOpen: false, fileName: 'hero.bxsprite', outcome: 'ok' });
  expect((await callMcp(rig.link.client, 'get_document', { documentId: String(again.data.documentId) })).data).toMatchObject({ ok: true, name: 'hero' });
  const outside = await callMcp(rig.link.client, 'open_file', { file: { ...file, path: '../escape.bxsprite' } });
  expect(outside.ok).toBe(false);
  expect((await filesOf(rig, 'nowhere')).code).toBe('FOLDER_NOT_FOUND');
};

const offAgain = async (rig: ProjectRig): Promise<void> => {
  await grant(rig, 'Off');
  expect((await manifestOnDisk(rig)).assistant.access).toBe('off');
  expect((await places(rig)).projects).toEqual([]);
  expect((await filesOf(rig)).code).toBe('PROJECT_NOT_FOUND');
};

const reopened = async (rig: ProjectRig): Promise<void> => {
  await grant(rig, 'Read and edit');
  expect((await places(rig)).projects).toMatchObject([{ access: 'edit' }]);
  await runMenu(rig.session, [/^Project/, /^Close project/]);
  await waitText(rig.session, /Closed the project Dungeon/);
  expect((await places(rig)).projects).toEqual([]);
  expect((await filesOf(rig)).code).toBe('PROJECT_NOT_FOUND');
  await answerDialogs(rig.session, { open: rig.projectDir, save: null });
  await runMenu(rig.session, [/^Project/, /^Open project/]);
  await waitText(rig.session, /Opened the project Dungeon/);
  expect((await places(rig)).projects).toMatchObject([{ name: NAME, access: 'edit' }]);
  expect((await filesOf(rig)).data).toMatchObject({ ok: true, total: 6 });
};

const assistantWrites = async (rig: ProjectRig): Promise<void> => {
  const saved = await saveIntoProject(rig, NAME, 'sprites/copy.bxsprite');
  expect(saved.data).toMatchObject({ ok: true, fileName: 'copy.bxsprite', place: await locationIn(rig, NAME, 'sprites/copy.bxsprite') });
  expect(readSaved(join(rig.projectDir, 'sprites', 'copy.bxsprite')).sprites).toHaveLength(1);
  expect((await saveIntoProject(rig, NAME, 'sprites/copy.bxsprite')).code).toBe('FILE_EXISTS');
  const exported = await exportIntoProject(rig, NAME, 'exports/hero.png');
  expect(exported.data).toMatchObject({ ok: true, files: [{ fileName: 'hero.png' }] });
  expect((await stat(join(rig.projectDir, 'exports', 'hero.png'))).size).toBeGreaterThan(0);
};

const assistantRefused = async (rig: ProjectRig): Promise<void> => {
  const documentId = await heroDocument(rig, NAME);
  await grant(rig, 'Read only');
  expect((await saveIntoProject(rig, NAME, 'sprites/refused.bxsprite')).code).toBe('PROJECT_NOT_GRANTED');
  expect((await exportIntoProject(rig, NAME, 'exports/refused.png')).code).toBe('PROJECT_NOT_GRANTED');
  await grant(rig, 'Off');
  expect((await saveIntoProject(rig, NAME, 'sprites/refused.bxsprite', documentId)).code).toBe('PROJECT_NOT_FOUND');
  expect(await readdir(join(rig.projectDir, 'sprites'))).toEqual(['copy.bxsprite']);
  expect(await readdir(join(rig.projectDir, 'exports'))).toEqual(['hero.png']);
};

const paneled = async ({ session, projectDir }: ProjectRig): Promise<void> => {
  await addProjectFileInUi(session, 'scrap');
  await renameProjectEntryInUi(session, 'scrap.bxsprite', 'junk.bxsprite');
  expect(await readdir(projectDir)).toContain('junk.bxsprite');
  expect(await readdir(projectDir)).not.toContain('scrap.bxsprite');
  await trashProjectEntryInUi(session, 'junk.bxsprite');
  expect(await readdir(projectDir)).not.toContain('junk.bxsprite');
  await createProjectFolderInUi(session, 'props');
  expect((await stat(join(projectDir, 'props'))).isDirectory()).toBe(true);
};

const watched = async ({ session, projectDir }: ProjectRig): Promise<void> => {
  await showPanelView(session, 'Folders');
  await writeFile(join(projectDir, 'outside.png'), new Uint8Array([1, 2, 3]));
  await listed(session, 'outside.png').waitFor({ timeout: POLL_MS });
};

const linked = async (rig: ProjectRig): Promise<void> => {
  const shared = await mkdtemp(join(dirname(rig.projectDir), 'bxel-e2e-linked-'));
  try {
    await grant(rig, 'Read and edit');
    await linkFolderInUi(rig.session, shared);
    expect((await manifestOnDisk(rig)).folders[1]?.path).toMatch(/^\.\.\/bxel-e2e-linked-/);
    expect((await places(rig)).projects[0]?.folders).toHaveLength(2);
    await unlinkFolderInUi(rig.session);
    expect((await manifestOnDisk(rig)).folders).toHaveLength(1);
  } finally {
    await rm(shared, { recursive: true, force: true });
  }
};

const assetsOverMcp = async (rig: ProjectRig): Promise<void> => {
  await grant(rig, 'Read and edit');
  const manifest = await manifestOnDisk(rig);
  const listed = await callMcp(rig.link.client, 'list_assets', { projectId: manifest.projectId, kinds: ['sprite'] });
  const assets = listed.data.assets as { kind: string; name: string; opened: boolean; location: unknown; id: string }[];
  const hero = assets.find((asset) => asset.name === 'hero');
  expect(hero).toMatchObject({ kind: 'sprite', opened: true });
  const open = await callMcp(rig.link.client, 'open_file', { file: hero?.location });
  expect(open.data).toMatchObject({ ok: true, asset: { kind: 'sprite', id: hero?.id }, legacy: false });
  const documentId = String(open.data.documentId);
  const saved = await callMcp(rig.link.client, 'save_document', { documentId, asset: { kind: 'sprite', id: hero?.id }, target: 'current' });
  expect(saved.data).toMatchObject({ ok: true, fileName: 'hero.bxsprite', asset: { kind: 'sprite', id: hero?.id } });
  await grant(rig, 'Read only');
  const refused = await callMcp(rig.link.client, 'save_document', { documentId, asset: { kind: 'sprite', id: hero?.id }, target: 'current' });
  expect(refused.data).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_GRANTED' } });
};

describe('projects: create, add a file, grant the assistant, browse over MCP', () => {
  const rig = useRig(openProjectRig);
  test('creates a project in a folder from the Project menu', () => created(rig()));
  test('adds a file to the project from the Project panel', () => filed(rig()));
  test('keeps an ungranted project invisible to the assistant', () => hidden(rig()));
  test('lists the files of a project granted read only', () => browsed(rig()));
  test('opens a project file, closes it and opens it again', () => opened(rig()));
  test('hides the project again when the grant is turned off', () => offAgain(rig()));
  test('keeps the grant when the project is closed and opened again', () => reopened(rig()));
  test('saves and exports into a project granted Read and edit', () => assistantWrites(rig()));
  test('refuses the same writes when the project is read only or off', () => assistantRefused(rig()));
  test('renames, trashes and makes folders from the Project panel', () => paneled(rig()));
  test('shows a file added on disk without a refresh', () => watched(rig()));
  test('links and unlinks a folder in the project settings', () => linked(rig()));
  test('lists assets, opens and saves one, and is refused when the project is read only', () => assetsOverMcp(rig()));
});
