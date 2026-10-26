/* @layer renderer-app @kind test */
import { access, mkdir, mkdtemp, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { createProjectInUi } from './support/create-project-in-ui';
import { APP_DIR, POLL_MS, PROJECT_PARENT, TEMP_PREFIX } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { openSession } from './support/open-session';
import { listed } from './support/project-entry-ui';
import { showPanelView } from './support/show-folder-view';
import { useRig } from './support/use-rig';

const NAME = 'Quarry';

const exists = (path: string): Promise<boolean> => access(path).then(() => true, () => false);

const palettesIn = async (dir: string): Promise<number> => (await readdir(dir)).filter((file) => file.endsWith('.bxpalette')).length;

const menuItem = (session: Session, name: RegExp) => session.page.getByRole('menu').getByRole('menuitem', { name });

const openRowMenu = async (session: Session, folder: string): Promise<void> => {
  await showPanelView(session, 'Folders');
  await listed(session, folder).click({ button: 'right' });
};

const open = async () => {
  const session = await openSession();
  const parent = join(APP_DIR, PROJECT_PARENT);
  await mkdir(parent, { recursive: true });
  const projectDir = await mkdtemp(join(parent, TEMP_PREFIX));
  await createProjectInUi(session, projectDir, NAME);
  const close = session.close;
  return { session: { ...session, close: () => close().then(() => rm(projectDir, { recursive: true, force: true })) }, projectDir };
};

describe('folder rows in the project panel: New asset here and New folder here', () => {
  const rig = useRig(open);

  test('a folder row menu offers both entries and makes a folder inside that folder', async () => {
    const { session, projectDir } = rig();
    await openRowMenu(session, 'exports');
    await menuItem(session, /^New asset here/).waitFor();
    await menuItem(session, /^New folder here/).click();
    await session.page.getByRole('textbox', { name: 'Folder name' }).fill('renders');
    await session.page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect.poll(() => exists(join(projectDir, 'exports', 'renders')), { timeout: POLL_MS }).toBe(true);
    expect(await exists(join(projectDir, 'renders'))).toBe(false);
  });

  test('New asset here, Sprite, files the new sprite in that folder', async () => {
    const { session, projectDir } = rig();
    await openRowMenu(session, 'tilemaps');
    await menuItem(session, /^New asset here/).click();
    await session.page.getByRole('menu').getByRole('menuitem', { name: 'Sprite', exact: true }).click();
    await session.page.getByRole('textbox', { name: 'File name' }).fill('boulder');
    await session.page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect.poll(() => exists(join(projectDir, 'tilemaps', 'boulder.bxsprite')), { timeout: POLL_MS }).toBe(true);
    expect(await exists(join(projectDir, 'sprites', 'boulder.bxsprite'))).toBe(false);
  });

  test('New asset here, Palette, opens the create dialog and files the palette in that folder', async () => {
    const { session, projectDir } = rig();
    await openRowMenu(session, 'exports');
    await menuItem(session, /^New asset here/).click();
    await session.page.getByRole('menu').getByRole('menuitem', { name: 'Palette', exact: true }).click();
    const dialog = session.page.getByRole('dialog', { name: 'New asset' });
    await dialog.getByRole('button', { name: /^Create palette/ }).click();
    await dialog.waitFor({ state: 'detached' });
    await expect.poll(() => palettesIn(join(projectDir, 'exports')), { timeout: POLL_MS }).toBe(1);
  });
});
