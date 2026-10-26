/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import type { Session } from './support/e2e.type';
import { inFreshPlace } from './support/in-place';
import { menuLabels, positionOf } from './support/menu-labels';
import { openSampleSheet } from './support/open-sample-sheet';
import { openSession } from './support/open-session';
import { openTilemapRig } from './support/open-tilemap-rig';

const NAMES = ['Timeline', 'Palette', 'Layers', 'Sheet', 'Tileset'] as const;

type Shown = Readonly<Record<(typeof NAMES)[number], boolean>>;

const shownRegions = async (session: Session): Promise<Shown> => {
  const counts = await Promise.all(NAMES.map((name) => session.page.getByRole('region', { name, exact: true }).count()));
  return Object.fromEntries(NAMES.map((name, at) => [name, (counts[at] ?? 0) > 0])) as Shown;
};

const canvasButtons = (session: Session, name: string): Promise<number> =>
  session.page.getByRole('toolbar', { name: 'Canvas' }).getByRole('button', { name, exact: true }).count();

const inOrder = (labels: readonly string[], wanted: readonly string[]): boolean => {
  const at = wanted.map((label) => positionOf(labels, label));
  return at.every((position) => position >= 0) && [...at].sort((a, b) => a - b).every((position, index) => position === at[index]);
};

const checksSprite = async (session: Session): Promise<void> => {
  expect(await shownRegions(session)).toEqual({ Timeline: true, Palette: true, Layers: true, Sheet: false, Tileset: false });
  for (const mode of ['Sprite', 'Sheet', 'Tilemap']) expect(await canvasButtons(session, mode)).toBe(0);
  expect(await canvasButtons(session, 'Mirror X')).toBe(1);
  const top = await menuLabels(session);
  expect(inOrder(top, ['File', 'Edit', 'Sprite', 'View', 'Project', 'Help', 'Settings'])).toBe(true);
  expect(positionOf(top, 'Sheet')).toBe(-1);
  expect(positionOf(top, 'Tilemap')).toBe(-1);
  const sprite = await menuLabels(session, [/^Sprite$/]);
  expect(sprite.map((label) => label.slice(0, 5))).toEqual(['Layer', 'Palet', 'Dupli', 'Sprit']);
};

const checksFileMenu = async (session: Session): Promise<void> => {
  const file = await menuLabels(session, [/^File$/]);
  expect(file).toHaveLength(8);
  expect(inOrder(file, ['New', 'Open...', 'Open recent', 'Save', 'Save as', 'Save all', 'Export', 'Import'])).toBe(true);
};

const checksTilemap = async (session: Session): Promise<void> => {
  expect(await shownRegions(session)).toEqual({ Timeline: false, Palette: false, Layers: true, Sheet: false, Tileset: true });
  expect(await canvasButtons(session, 'Mirror X')).toBe(0);
  const top = await menuLabels(session);
  expect(positionOf(top, 'Tilemap')).toBeGreaterThan(positionOf(top, 'Edit'));
  expect(positionOf(top, 'Sprite')).toBe(-1);
  expect(positionOf(top, 'Sheet')).toBe(-1);
};

const checksSheet = async (session: Session, place: string): Promise<void> => {
  await openSampleSheet(session, place);
  expect(await shownRegions(session)).toEqual({ Timeline: false, Palette: false, Layers: false, Sheet: true, Tileset: false });
  expect(await canvasButtons(session, 'Mirror X')).toBe(0);
  expect(await canvasButtons(session, 'Zoom to fit')).toBe(1);
  const top = await menuLabels(session);
  expect(positionOf(top, 'Sheet')).toBeGreaterThan(positionOf(top, 'Edit'));
  expect(positionOf(top, 'Sprite')).toBe(-1);
  const sheet = await menuLabels(session, [/^Sheet$/]);
  expect(sheet.some((label) => label.startsWith('Isolate sprite'))).toBe(true);
  expect(sheet.some((label) => /mode/i.test(label))).toBe(false);
};

describe('the open asset decides what the editor shows', () => {
  test('a sprite shows the drawing panels and tools and no sheet or tilemap parts', async () => {
    const session = await openSession();
    try {
      await checksSprite(session);
    } finally {
      await session.close();
    }
  });

  test('the file menu lists New, Open, Open recent, Save, Save as, Save all, Export and Import in that order', async () => {
    const session = await openSession();
    try {
      await checksFileMenu(session);
    } finally {
      await session.close();
    }
  });

  test('a tilemap shows the tileset panel and the map tools and no drawing panels or Sprite menu', async () => {
    const { session } = await openTilemapRig();
    try {
      await checksTilemap(session);
    } finally {
      await session.close();
    }
  });

  test('a sheet shows the sheet manager and no drawing panels, mode buttons or Sprite menu', async () => {
    const session = await openSession();
    try {
      await inFreshPlace((place) => checksSheet(session, place));
    } finally {
      await session.close();
    }
  });
});
