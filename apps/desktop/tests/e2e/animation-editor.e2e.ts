/* @layer renderer-app @kind test */
import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { findAnimation, flattenFrame } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { ANIMATED } from './support/animated-project.constants';
import { fillNumber, frameButton, openAnimationTab, timelineOf } from './support/animation-ui';
import { canvasMapper } from './support/canvas-mapper';
import { drawStroke } from './support/draw-stroke';
import { POLL_MS, SHORTCUT } from './support/e2e.constants';
import type { Cell, Session } from './support/e2e.type';
import { openAnimatedRig } from './support/open-animated-rig';
import { pickSwatch } from './support/pick-swatch';
import { assetDigests, fileNamed } from './support/project-files';
import { readSaved } from './support/read-saved';
import { sampleCanvas } from './support/sample-canvas';
import { useRig } from './support/use-rig';
import { waitText } from './support/wait-text';

const SIZE = { width: ANIMATED.side, height: ANIMATED.side };

const changedFiles = (before: ReadonlyMap<string, string>, after: ReadonlyMap<string, string>): string[] =>
  [...after].filter(([name, hash]) => before.get(name) !== hash).map(([name]) => name).sort();

const exists = (path: string): Promise<boolean> => access(path).then(() => true, () => false);

const bar = (session: Session) => session.page.getByRole('status', { name: 'Sprites that became animations' });

const recordFrames = (session: Session, milliseconds: number): Promise<number[]> =>
  session.page.evaluate(async (duration) => {
    const seen: number[] = [];
    const end = performance.now() + duration;
    while (performance.now() < end) {
      const label = document.querySelector('[aria-label="Timeline controls"] [aria-current="true"]')?.getAttribute('aria-label') ?? '';
      const number = Number(/^Frame (\d+),/.exec(label)?.[1]);
      if (Number.isFinite(number) && seen.at(-1) !== number) seen.push(number);
      await new Promise((done) => setTimeout(done, 12));
    }
    return seen;
  }, milliseconds);

const migrates = async (session: Session, root: string): Promise<void> => {
  await expect.poll(() => bar(session).innerText(), { timeout: POLL_MS }).toContain('1 sprite had frames. It became 1 animation. Save to write it.');
  expect(await exists(join(root, 'sprites', 'hero.bxsprite'))).toBe(true);
  await bar(session).getByRole('button', { name: 'Show changes' }).click();
  await session.page.getByRole('listitem').filter({ hasText: 'hero became animation hero with 3 frames' }).waitFor();
  await session.page.getByRole('dialog', { name: 'Sprites that became animations' }).locator('button').filter({ hasText: 'Close' }).click();
  await bar(session).getByRole('button', { name: 'Save all' }).click();
  await session.page.getByRole('button', { name: 'Move to trash', exact: true }).click();
  await bar(session).waitFor({ state: 'detached' });
  const saved = await fileNamed(root, 'hero.bxanim');
  const artwork = readSaved(saved);
  const hero = artwork.animations.find((animation) => animation.name === ANIMATED.hero);
  expect(hero?.frames).toHaveLength(3);
  expect(hero?.tags).toMatchObject([{ kind: 'span', name: ANIMATED.tag, direction: 'pingpong' }]);
  await expect.poll(() => exists(join(root, 'sprites', 'hero.bxsprite')), { timeout: POLL_MS }).toBe(false);
};

const plays = async (session: Session): Promise<void> => {
  await openAnimationTab(session, ANIMATED.hero);
  await timelineOf(session).getByRole('combobox', { name: 'Tag to play' }).click();
  await session.page.getByRole('option', { name: new RegExp(`^${ANIMATED.tag}`) }).click();
  await timelineOf(session).getByRole('button', { name: 'Play', exact: true }).click();
  const seen = await recordFrames(session, 2200);
  await timelineOf(session).getByRole('button', { name: 'Pause', exact: true }).click();
  const moves = seen.slice(1).map((number, at) => `${seen[at]}>${number}`);
  expect(moves.length, `the frames seen: ${seen.join(',')}`).toBeGreaterThan(6);
  const allowed = new Set(['1>2', '2>3', '3>2', '2>1']);
  expect(moves.filter((move) => !allowed.has(move)), `the frames seen: ${seen.join(',')}`).toEqual([]);
  expect(moves).toContain('3>2');
  expect(moves).toContain('2>1');
};

const aligns = async (session: Session): Promise<void> => {
  await frameButton(session, 2).click();
  await fillNumber(timelineOf(session).getByRole('spinbutton', { name: 'Frame offset across' }), -2);
  const map = await canvasMapper(session, SIZE);
  const [first, second] = ANIMATED.marks;
  const ghostAt: Cell = { x: first.x + 2, y: first.y };
  const own: Cell = { x: first.x, y: first.y };
  const before = await sampleCanvas(session, [map(ghostAt), map(own), map({ x: second.x, y: second.y })]);
  await timelineOf(session).getByRole('button', { name: 'Onion skin' }).click();
  await timelineOf(session).getByRole('button', { name: 'Onion skin', pressed: true }).waitFor();
  await expect.poll(async () => (await sampleCanvas(session, [map(ghostAt)]))[0], { timeout: POLL_MS }).not.toBe(before[0]);
  const after = await sampleCanvas(session, [map(ghostAt), map(own), map({ x: second.x, y: second.y })]);
  expect(after[1], 'the old position of the mark stays clear').toBe(before[1]);
  expect(after[2], 'the pixel of the shown frame is not covered').toBe(before[2]);
  await timelineOf(session).getByRole('button', { name: 'Onion skin', pressed: true }).click();
  await fillNumber(timelineOf(session).getByRole('spinbutton', { name: 'Frame offset across' }), 0);
};

const paintShared = async (session: Session, cell: Cell, swatch: number): Promise<void> => {
  const map = await canvasMapper(session, SIZE);
  await pickSwatch(session, swatch);
  await drawStroke(session, map, [cell, { x: cell.x + 1, y: cell.y }]);
};

const sharesTheSprite = async (session: Session, root: string): Promise<void> => {
  await openAnimationTab(session, ANIMATED.blink);
  await session.page.getByText('Also used by world.').waitFor();
  await session.page.getByRole('button', { name: 'Open sprite' }).waitFor();
  const before = await assetDigests(root);
  await paintShared(session, { x: 6, y: 6 }, 3);
  await session.page.keyboard.press(SHORTCUT.saveAll);
  await expect.poll(async () => changedFiles(before, await assetDigests(root)), { timeout: POLL_MS }).toEqual(['tree.bxsprite']);
};

const copiesTheSprite = async (session: Session, root: string): Promise<void> => {
  const tree = await assetDigests(root);
  await session.page.getByRole('button', { name: 'Make a copy for this animation' }).click();
  await waitText(session, /owned by this animation/);
  await paintShared(session, { x: 1, y: 6 }, 4);
  await session.page.keyboard.press(SHORTCUT.saveAll);
  await expect.poll(async () => changedFiles(tree, await assetDigests(root)), { timeout: POLL_MS }).toEqual(['blink.bxanim']);
  const artwork = readSaved(await fileNamed(root, 'blink.bxanim'));
  const blink = artwork.animations.find((animation) => animation.name === ANIMATED.blink);
  const frame = blink?.frames[0];
  const sprite = artwork.sprites.find((each) => each.id === frame?.spriteId);
  expect(sprite?.role).toBe('frame');
  if (!sprite) throw new Error('the frame has no sprite');
  const indices = flattenFrame(sprite, sprite.frames[0]?.id as never);
  expect(indices[6 * SIZE.width + 1]).toBe(4);
  expect(indices[ANIMATED.treeMark.y * SIZE.width + ANIMATED.treeMark.x]).toBe(ANIMATED.treeMark.index);
  expect(findAnimation(artwork, blink?.id as never)?.frames[1]?.spriteId).not.toBe(frame?.spriteId);
};

describe('the animation editor', () => {
  const rig = useRig(openAnimatedRig);
  test('the migration bar lists the converted sprites and Save all writes the animation', () => migrates(rig().session, rig().root));
  test('a ping-pong tag plays out and back', () => plays(rig().session));
  test('the onion ghost of the other frame sits where the offsets put it', () => aligns(rig().session));
  test('drawing on a shared sprite changes only the sprite file', () => sharesTheSprite(rig().session, rig().root));
  test('a copy for this animation leaves the shared sprite alone', () => copiesTheSprite(rig().session, rig().root));
});
