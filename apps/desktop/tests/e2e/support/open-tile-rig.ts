/* @layer renderer-app @kind logic */
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { buildFolderArtwork } from './build-folder-artwork';
import { APP_DIR, PROJECT_PARENT, SHORTCUT, TEMP_PREFIX } from './e2e.constants';
import { FOLDER_SHEET } from './folder-artwork.constants';
import { openProjectAtInUi } from './open-project-at-in-ui';
import { openSession } from './open-session';
import { openSheetTab } from './open-sheet-tab';
import { readSaved } from './read-saved';
import { resizeWindow } from './resize-window';
import type { SavedSheet, TileRig } from './tile-rig.type';
import { writeSampleProject } from './write-sample-project';

const readSheet = (file: string): SavedSheet | null => {
  try {
    const artwork = readSaved(file);
    const sheet = artwork.sheets.find((each) => each.name === FOLDER_SHEET);
    if (!sheet) return null;
    const nameOf = (id: string): string => artwork.sprites.find((sprite) => sprite.id === id)?.name ?? id;
    return {
      names: sheet.entries.map((entry) => nameOf(entry.spriteId)),
      at: Object.fromEntries(sheet.entries.map((entry) => [nameOf(entry.spriteId), entry.at])),
      layout: sheet.layout.kind,
    };
  } catch {
    return null;
  }
};

const openTileRig = async (): Promise<TileRig> => {
  const parent = join(APP_DIR, PROJECT_PARENT);
  await mkdir(parent, { recursive: true });
  const place = await mkdtemp(join(parent, TEMP_PREFIX));
  const root = join(place, 'Folders');
  const paths = await writeSampleProject(root, buildFolderArtwork(), 'Folders');
  const sheetFile = [...paths.values()].find((path) => path.endsWith(`${FOLDER_SHEET}.bxsheet`)) ?? '';
  const session = await openSession();
  await openProjectAtInUi(session, root, 'Folders');
  await resizeWindow(session, 1600, 900);
  await openSheetTab(session, FOLDER_SHEET);
  const close = session.close;
  return {
    session: { ...session, close: () => close().then(() => rm(place, { recursive: true, force: true })) },
    sheetFile,
    saved: async () => {
      await session.page.keyboard.press(SHORTCUT.saveAll);
      return readSheet(sheetFile);
    },
  };
};

export { openTileRig };
