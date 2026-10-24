/* @layer renderer-app @kind test */
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Artwork, DocumentId } from '@bxel/document';
import { encodeArtwork } from '@bxel/document/native';
import { createFolderId, createManifest, createProjectId, createSwatchSetId, manifestFileName, writeManifest } from '@bxel/project';
import { describe, expect, test } from 'vitest';
import { answerDialogs } from './support/answer-dialogs';
import { buildSampleArtwork } from './support/build-sample-artwork';
import { canvasMapper } from './support/canvas-mapper';
import { drawStroke } from './support/draw-stroke';
import { APP_DIR, PROJECT_PARENT, TEMP_PREFIX } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { openFile } from './support/open-file';
import { openSession } from './support/open-session';
import { pickSwatch } from './support/pick-swatch';
import { readSaved } from './support/read-saved';
import { runMenu } from './support/run-menu';
import { SAMPLE } from './support/sample.constants';
import { useRig } from './support/use-rig';
import { waitSaved } from './support/wait-saved';
import { waitText } from './support/wait-text';
import { waitUnsaved } from './support/wait-unsaved';
import { writeSampleProject } from './support/write-sample-project';

const SAVE_ALL = 'Control+Alt+s';

const placeFor = async (): Promise<string> => {
  const parent = join(APP_DIR, PROJECT_PARENT);
  await mkdir(parent, { recursive: true });
  return mkdtemp(join(parent, TEMP_PREFIX));
};

const inPlace = async (run: (place: string) => Promise<void>): Promise<void> => {
  const place = await placeFor();
  try {
    await run(place);
  } finally {
    await rm(place, { recursive: true, force: true });
  }
};

const byId = (left: { id: string }, right: { id: string }): number => left.id.localeCompare(right.id);

const openProjectAt = async (session: Session, folder: string, name: string): Promise<void> => {
  await answerDialogs(session, { open: folder, save: null });
  await runMenu(session, [/^Project/, /^Open project/]);
  await waitText(session, new RegExp(`Opened the project ${name}`));
};

const snapshot = async (paths: ReadonlyMap<string, string>): Promise<Map<string, Buffer>> =>
  new Map(await Promise.all([...paths.values()].map(async (path) => [path, await readFile(path)] as const)));

const sameContent = (left: Artwork, right: Artwork): void => {
  expect([...left.sprites].sort(byId)).toEqual([...right.sprites].sort(byId));
  expect([...left.sheets].sort(byId)).toEqual([...right.sheets].sort(byId));
  expect(left.banks).toEqual(right.banks);
};

const changedFiles = (before: ReadonlyMap<string, Buffer>, after: ReadonlyMap<string, Buffer>): string[] =>
  [...after].filter(([path, bytes]) => Buffer.compare(bytes, before.get(path) ?? Buffer.alloc(0)) !== 0).map(([path]) => path);

const heroOf = (artwork: Artwork) => {
  const hero = artwork.sprites.find((sprite) => sprite.name === SAMPLE.sprites[0]);
  if (!hero) throw new Error('no hero');
  return hero;
};

const paintsAndSavesAll = async (session: Session, place: string): Promise<void> => {
  const root = join(place, 'Sample');
  const artwork = buildSampleArtwork();
  const paths = await writeSampleProject(root, artwork, SAMPLE.name);
  await openProjectAt(session, root, SAMPLE.name);
  await session.page.getByRole('tablist', { name: 'Open assets' }).getByRole('tab', { name: new RegExp(SAMPLE.sprites[0]) }).waitFor();
  const before = await snapshot(paths);
  const hero = heroOf(artwork);
  const map = await canvasMapper(session, SAMPLE.size);
  await pickSwatch(session, 2);
  await drawStroke(session, map, [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }]);
  await waitUnsaved(session);
  await session.page.keyboard.press(SAVE_ALL);
  await waitSaved(session);
  expect(changedFiles(before, await snapshot(paths))).toEqual([paths.get(hero.id)]);
  const walk = readSaved(join(root, 'sheets', 'walk.bxsheet')).sprites.find((sprite) => sprite.id === hero.id);
  const idle = readSaved(join(root, 'sheets', 'idle.bxsheet')).sprites.find((sprite) => sprite.id === hero.id);
  expect(walk?.cels).not.toEqual(hero.cels);
  expect(idle).toEqual(walk);
};

const splitsOlderFile = async (session: Session, place: string): Promise<void> => {
  const artwork = { ...buildSampleArtwork(), name: 'Older' };
  const older = join(place, 'old.bxel');
  const bytes = encodeArtwork({ documentId: 'doc_e2e' as DocumentId, revision: 1, artwork, readOnly: false }, null, () => 0);
  await writeFile(older, bytes);
  await openFile(session, older);
  await waitText(session, /This older Bxel file holds 2 sprites, 2 sheets and 1 palette/);
  await session.page.getByRole('button', { name: 'Split into files...' }).click();
  const dialog = session.page.getByRole('dialog', { name: 'Split into separate files' });
  await dialog.waitFor();
  await answerDialogs(session, { open: place, save: null });
  await dialog.getByRole('button', { name: 'Split', exact: true }).click();
  await waitText(session, /Opened the project Older/);
  expect(Buffer.compare(await readFile(older), Buffer.from(bytes))).toBe(0);
  const walk = artwork.sheets.filter((sheet) => sheet.name === 'walk');
  sameContent(readSaved(join(place, 'Older', 'sheets', 'walk.bxsheet')), { ...artwork, sheets: walk });
};

const idBytes = (length: number): Uint8Array => Uint8Array.from({ length }, (_unused, at) => at + 9);

const migratesProject = async (session: Session, place: string): Promise<void> => {
  const root = join(place, 'Old');
  await mkdir(root, { recursive: true });
  const seed = createManifest({ projectId: createProjectId(idBytes), folderId: createFolderId(idBytes), name: 'Old' });
  const warm = { setId: createSwatchSetId(idBytes), name: 'Warm', colors: [{ rgb: '#ff0000', name: 'Red' }] };
  const text = writeManifest({ ...seed, swatchSets: [warm] });
  if (!text.ok) throw new Error(text.message);
  await writeFile(join(root, manifestFileName('Old')), text.value);
  await openProjectAt(session, root, 'Old');
  await waitText(session, /Updated the project file to the new format/);
  await access(join(root, 'Old.bxproject'));
  await access(join(root, 'palettes', 'Warm.bxpalette'));
  await expect(access(join(root, manifestFileName('Old')))).rejects.toThrow();
};

describe('check 9: one workspace per project, one file per asset', () => {
  const rig = useRig(async () => ({ session: await openSession() }));
  test('opens every asset of a project, paints a sprite used by two sheets and Save all writes only its file', () =>
    inPlace((place) => paintsAndSavesAll(rig().session, place)));
  test('splits an older file with several assets into a project that reopens identical', () => inPlace((place) => splitsOlderFile(rig().session, place)));
  test('updates an older project file to the new format when it opens', () => inPlace((place) => migratesProject(rig().session, place)));
});
