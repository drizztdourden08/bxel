/* @layer renderer-app @kind test */
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { answerDialogs } from './support/answer-dialogs';
import { buildTwoPaletteArtwork, SECOND_PALETTE } from './support/build-two-palette-artwork';
import type { Session } from './support/e2e.type';
import { inFreshPlace } from './support/in-place';
import { openSession } from './support/open-session';
import { projectOnDisk } from './support/project-on-disk';
import { readSaved } from './support/read-saved';
import { runMenu } from './support/run-menu';
import { SAMPLE } from './support/sample.constants';
import { useRig } from './support/use-rig';
import { waitText } from './support/wait-text';
import { writeSampleProject } from './support/write-sample-project';

const OPEN_SETTINGS = 'Control+,';

const POLL = { timeout: 15000 } as const;

const switchTo = async (session: Session, hub: string): Promise<void> => {
  await session.page.getByRole('navigation', { name: 'Switch hub' }).getByRole('button', { name: hub, exact: true }).click();
};

const openProjectAt = async (session: Session, folder: string): Promise<void> => {
  await answerDialogs(session, { open: folder, save: null });
  await runMenu(session, [/^Project/, /^Open project/]);
  await waitText(session, new RegExp(`Opened the project ${SAMPLE.name}`));
  await session.page.getByRole('tablist', { name: 'Open assets' }).getByRole('tab', { name: new RegExp(SAMPLE.sprites[0]) }).waitFor();
};

const movesBetweenHubs = async (session: Session): Promise<void> => {
  const { page } = session;
  await page.keyboard.press(OPEN_SETTINGS);
  await page.getByText('Window mode', { exact: true }).waitFor();
  await switchTo(session, 'Asset');
  await page.getByText('Pivot x', { exact: true }).waitFor();
  await switchTo(session, 'Project');
  await page.getByText('No project open', { exact: true }).waitFor();
  await switchTo(session, 'App');
  await page.getByText('Window mode', { exact: true }).waitFor();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Control+Alt+Enter');
  await page.getByText('Pivot x', { exact: true }).waitFor();
  await page.keyboard.press('Escape');
};

const spriteWidth = (path: string): number | null => {
  try {
    return readSaved(path).sprites[0]?.width ?? null;
  } catch {
    return null;
  }
};

const bankOf = (path: string, spriteId: string): string | undefined => readSaved(path).sprites.find((sprite) => sprite.id === spriteId)?.bankId;

const picksUpProjectDefault = async (session: Session, place: string): Promise<void> => {
  const { page } = session;
  const root = join(place, SAMPLE.name);
  await writeSampleProject(root, buildTwoPaletteArtwork(), SAMPLE.name);
  await openProjectAt(session, root);
  await page.keyboard.press(OPEN_SETTINGS);
  await switchTo(session, 'Project');
  await page.getByText('Defaults for new assets', { exact: true }).first().click();
  await page.getByText('Uses the app default: 16 by 16 pixels', { exact: true }).waitFor();
  await page.getByRole('spinbutton', { name: 'Width' }).fill('24');
  await page.getByRole('button', { name: 'Use the app default' }).first().waitFor();
  await expect.poll(async () => (await projectOnDisk(root, SAMPLE.name)).defaults.size, POLL).toEqual({ width: 24, height: 16 });
  await page.keyboard.press('Escape');
  await page.keyboard.press('Control+n');
  const dialog = page.getByRole('dialog', { name: 'New asset' });
  await dialog.getByRole('spinbutton', { name: 'Width' }).waitFor();
  expect(await dialog.getByRole('spinbutton', { name: 'Width' }).inputValue()).toBe('24');
  await dialog.getByRole('button', { name: 'Create sprite' }).click();
  await dialog.waitFor({ state: 'detached' });
  await expect.poll(() => readdir(join(root, 'sprites')), POLL).toContain('sprite.bxsprite');
  await expect.poll(() => spriteWidth(join(root, 'sprites', 'sprite.bxsprite')), POLL).toBe(24);
};

const changesThePalette = async (session: Session, place: string): Promise<void> => {
  const { page } = session;
  const root = join(place, SAMPLE.name);
  const artwork = buildTwoPaletteArtwork();
  await writeSampleProject(root, artwork, SAMPLE.name);
  await openProjectAt(session, root);
  const hero = artwork.sprites.find((sprite) => sprite.name === SAMPLE.sprites[0]);
  const warm = artwork.banks.find((bank) => bank.name === SECOND_PALETTE);
  if (!hero || !warm) throw new Error('the sample lacks its sprite or palette');
  const heroFile = join(root, 'sprites', 'hero.bxsprite');
  await page.getByRole('button', { name: 'Palette settings' }).click();
  await page.getByRole('combobox', { name: 'Palette', exact: true }).click();
  await page.getByRole('option', { name: new RegExp(SECOND_PALETTE) }).click();
  const dialog = page.getByRole('dialog', { name: 'Change palette' });
  await dialog.waitFor();
  await dialog.getByRole('button', { name: 'Change palette' }).click();
  await dialog.waitFor({ state: 'detached' });
  await page.keyboard.press('Escape');
  await page.keyboard.press('Control+Alt+s');
  await expect.poll(() => bankOf(heroFile, hero.id), POLL).toBe(warm.id);
  await runMenu(session, [/^Edit/, /^Undo/]);
  await page.keyboard.press('Control+Alt+s');
  await expect.poll(() => bankOf(heroFile, hero.id), POLL).toBe(hero.bankId);
};

describe('the configuration window', () => {
  const rig = useRig(async () => ({ session: await openSession() }));

  test('the hub switch moves between Asset, Project and App', () => movesBetweenHubs(rig().session));
});

describe('the project defaults', () => {
  const rig = useRig(async () => ({ session: await openSession() }));

  test('show the app default until they are set, and a new sprite picks them up', () => inFreshPlace((place) => picksUpProjectDefault(rig().session, place)));
});

describe('the palette of a sprite', () => {
  const rig = useRig(async () => ({ session: await openSession() }));

  test('is changed through the remap dialog and one undo puts it back', () => inFreshPlace((place) => changesThePalette(rig().session, place)));
});
