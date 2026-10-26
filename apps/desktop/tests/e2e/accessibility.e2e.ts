/* @layer renderer-app @kind test */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { DocumentId } from '@bxel/document';
import { encodeArtwork } from '@bxel/document/native';
import { describe, test } from 'vitest';
import { answerDialogs } from './support/answer-dialogs';
import { buildManyAssets } from './support/build-many-assets';
import { buildSampleArtwork } from './support/build-sample-artwork';
import { createSprite } from './support/create-sprite';
import { SHORTCUT } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { expectAccessible } from './support/expect-accessible';
import { inFreshPlace } from './support/in-place';
import { managerAssets } from './support/manager-assets';
import { openFile } from './support/open-file';
import { openHub } from './support/open-hub';
import { openProjectAtInUi } from './support/open-project-at-in-ui';
import { openSheetTab } from './support/open-sheet-tab';
import { openSession } from './support/open-session';
import { openTilemapRig } from './support/open-tilemap-rig';
import { SAMPLE } from './support/sample.constants';
import { showPanelView } from './support/show-folder-view';
import { showSheetList } from './support/show-sheet-list';
import { writeBlocksPng } from './support/write-blocks-png';
import { writeSampleProject } from './support/write-sample-project';

const SETTINGS = 'Control+,';

const LONG_LIST = 210;

const APP_PAGES = ['Grid and rulers', 'Surround pattern', 'Canvas', 'Palette library', 'Platform presets'] as const;

const reduceMotion = (session: Session): Promise<void> => session.page.emulateMedia({ reducedMotion: 'reduce' });

const checksSettingsHubs = async (session: Session): Promise<void> => {
  const { page } = session;
  await page.keyboard.press(SETTINGS);
  await page.getByText('Window mode', { exact: true }).waitFor();
  await expectAccessible(session, 'settings, App hub');
  for (const name of APP_PAGES) {
    await page.getByRole('button', { name, exact: true }).first().click();
    await expectAccessible(session, `settings, App hub, ${name}`);
  }
  await page.getByRole('button', { name: 'General', exact: true }).first().click();
  for (const hub of ['Asset', 'Project']) {
    await page.getByRole('navigation', { name: 'Switch hub' }).getByRole('button', { name: hub, exact: true }).click();
    await expectAccessible(session, `settings, ${hub} hub`);
  }
  await page.keyboard.press('Escape');
};

const checksDialog = async (session: Session, name: string, open: () => Promise<void>): Promise<void> => {
  const dialog = session.page.getByRole('dialog', { name });
  await open();
  await dialog.waitFor();
  await expectAccessible(session, `${name} dialog`);
  await session.page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'detached' });
};

const checksMenu = async (session: Session): Promise<void> => {
  const { page } = session;
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('menu').first().waitFor();
  await expectAccessible(session, 'the app menu open');
  await page.keyboard.press('Escape');
  await page.getByRole('menu').first().waitFor({ state: 'detached' });
};

const checksImportWizard = async (session: Session): Promise<void> => {
  const { page } = session;
  await answerDialogs(session, { open: await writeBlocksPng(session.dir), save: null });
  await page.keyboard.press(SHORTCUT.importImage);
  const wizard = page.getByRole('dialog', { name: /^Import image/ });
  await wizard.waitFor();
  await expectAccessible(session, 'Import dialog, source step');
  await wizard.getByRole('button', { name: 'Next: Colours' }).click();
  await expectAccessible(session, 'Import dialog, colours step');
  await wizard.getByRole('button', { name: 'Cancel' }).click();
  await wizard.waitFor({ state: 'detached' });
};

const checksManager = async (session: Session): Promise<void> => {
  await openHub(session, 'Project');
  await expectAccessible(session, 'Project hub, project manager');
  await managerAssets(session).getByRole('listitem').filter({ hasText: SAMPLE.sprites[0] }).first().click();
  await session.page.getByRole('group', { name: `What to do with ${SAMPLE.sprites[0]}` }).getByRole('button', { name: 'Open in Asset settings' }).click();
  await session.page.getByRole('textbox', { name: 'Name' }).waitFor();
  await expectAccessible(session, 'Asset hub, overview');
  await session.page.keyboard.press('Escape');
};

const checksProject = async (session: Session, place: string): Promise<void> => {
  const root = join(place, 'Sample');
  await writeSampleProject(root, buildSampleArtwork(), SAMPLE.name);
  await openProjectAtInUi(session, root, SAMPLE.name);
  await showPanelView(session, 'Assets');
  await expectAccessible(session, 'Project panel, Assets view');
  await showPanelView(session, 'Folders');
  await expectAccessible(session, 'Project panel, Folders view');
  await openSheetTab(session, SAMPLE.sheets[0]);
  await expectAccessible(session, 'Sheet mode with the sheet manager');
  await showSheetList(session);
  await expectAccessible(session, 'Sheet manager, list view');
  await checksManager(session);
};

const checksLongList = async (session: Session, place: string): Promise<void> => {
  const root = join(place, 'Long');
  await writeSampleProject(root, buildManyAssets(LONG_LIST), SAMPLE.name);
  await openProjectAtInUi(session, root, SAMPLE.name);
  await openSheetTab(session, 'sh001');
  await showSheetList(session);
  await expectAccessible(session, 'Sheet manager, long list view');
};

const checksSplit = async (session: Session, place: string): Promise<void> => {
  const artwork = { ...buildSampleArtwork(), name: 'Older' };
  const older = join(place, 'old.bxel');
  await writeFile(older, encodeArtwork({ documentId: 'doc_e2e' as DocumentId, revision: 1, artwork, readOnly: false }, null, () => 0));
  await openFile(session, older);
  await checksDialog(session, 'Split into separate files', () => session.page.getByRole('button', { name: 'Split into files...' }).click());
};

describe('accessibility: no serious or critical axe finding', () => {
  test('the Sprite editor, the settings hubs and the New asset, Export and Import dialogs', async () => {
    const session = await openSession();
    try {
      await reduceMotion(session);
      await createSprite(session);
      await expectAccessible(session, 'Sprite mode');
      await checksMenu(session);
      await checksSettingsHubs(session);
      await checksDialog(session, 'New asset', () => session.page.keyboard.press(SHORTCUT.newFile));
      await answerDialogs(session, { open: null, save: null });
      await checksDialog(session, 'Export', () => session.page.keyboard.press(SHORTCUT.exportImages));
      await checksImportWizard(session);
    } finally {
      await session.close();
    }
  });

  test('Tilemap mode with the tileset widget', async () => {
    const rig = await openTilemapRig();
    try {
      await reduceMotion(rig.session);
      await expectAccessible(rig.session, 'Tilemap mode');
    } finally {
      await rig.session.close();
    }
  });

  test('a project in the Assets view, the Folders view and Sheet mode', async () => {
    const session = await openSession();
    try {
      await reduceMotion(session);
      await inFreshPlace((place) => checksProject(session, place));
    } finally {
      await session.close();
    }
  });

  test('the sheet manager list view with a long list of sprites', async () => {
    const session = await openSession();
    try {
      await reduceMotion(session);
      await inFreshPlace((place) => checksLongList(session, place));
    } finally {
      await session.close();
    }
  });

  test('the Split dialog on an older file', async () => {
    const session = await openSession();
    try {
      await reduceMotion(session);
      await inFreshPlace((place) => checksSplit(session, place));
    } finally {
      await session.close();
    }
  });
});
